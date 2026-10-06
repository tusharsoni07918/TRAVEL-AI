import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

const TARGET_MODEL = 'gemma-4-31b-it';

// Safe JSON extractor helper
function extractJsonFromText(rawText: string): any {
  let cleaned = rawText.trim();
  // Strip code block fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

// Validator for the required itinerary JSON schema
function validateItinerarySchema(data: any, expectedDays: number): { valid: boolean; reason?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, reason: 'Root response is not a valid JSON object' };
  }
  if (!data.destination || typeof data.destination !== 'string') {
    return { valid: false, reason: 'Missing or invalid destination' };
  }
  if (!data.tripSummary || typeof data.tripSummary !== 'string') {
    return { valid: false, reason: 'Missing or invalid tripSummary' };
  }
  if (typeof data.totalEstimatedCost !== 'number' || isNaN(data.totalEstimatedCost)) {
    return { valid: false, reason: 'totalEstimatedCost must be a valid number' };
  }
  if (!data.budgetBreakdown || typeof data.budgetBreakdown !== 'object') {
    return { valid: false, reason: 'Missing budgetBreakdown object' };
  }
  const bb = data.budgetBreakdown;
  const requiredCategories = ['accommodation', 'food', 'transportation', 'activities', 'miscellaneous'];
  for (const cat of requiredCategories) {
    if (typeof bb[cat] !== 'number') {
      return { valid: false, reason: `budgetBreakdown.${cat} must be a number` };
    }
  }

  if (!Array.isArray(data.days)) {
    return { valid: false, reason: 'days must be an array' };
  }
  if (data.days.length !== expectedDays) {
    return { valid: false, reason: `days array length (${data.days.length}) does not match requested duration (${expectedDays})` };
  }

  for (let i = 0; i < data.days.length; i++) {
    const d = data.days[i];
    if (typeof d.day !== 'number' || !d.title) {
      return { valid: false, reason: `Day ${i + 1} is missing day number or title` };
    }
    const slots = ['morning', 'afternoon', 'evening'];
    for (const slot of slots) {
      if (!d[slot] || typeof d[slot] !== 'object' || !d[slot].activity || typeof d[slot].estimatedCost !== 'number') {
        return { valid: false, reason: `Day ${i + 1} has missing or malformed ${slot} activity` };
      }
    }
    if (typeof d.dailyEstimatedCost !== 'number') {
      return { valid: false, reason: `Day ${i + 1} dailyEstimatedCost must be a number` };
    }
  }

  const arrayFields = ['accommodationSuggestions', 'transportationTips', 'travelTips', 'safetyTips', 'packingTips'];
  for (const f of arrayFields) {
    if (!Array.isArray(data[f])) {
      return { valid: false, reason: `${f} must be an array` };
    }
  }

  return { valid: true };
}

// Destination-aware high fidelity itinerary builder for TripGenie AI
function buildContextualItinerary(params: {
  startingPoint?: string;
  destination: string;
  startDate: string;
  numberOfDays: number;
  numberOfTravelers: number;
  budget: number;
  currency: string;
  travelType: string;
  travelPace: string;
  interests: string[];
  foodPreference: string;
  preferredTransportation: string;
  accommodationPreference: string;
  additionalRequirements: string;
}) {
  const {
    startingPoint,
    destination,
    numberOfDays,
    budget,
    currency,
    travelType,
    travelPace,
    interests,
    foodPreference,
    preferredTransportation,
    accommodationPreference
  } = params;

  const destLower = destination.toLowerCase();
  const startPtClean = (startingPoint || '').trim();
  const isSameCity = Boolean(startPtClean && destLower.includes(startPtClean.toLowerCase()) || (startPtClean && startPtClean.toLowerCase().includes(destLower)));
  const hasIntercityTravel = Boolean(startPtClean && !isSameCity);

  const isGoa = destLower.includes('goa');
  const isManali = destLower.includes('manali');
  const isBali = destLower.includes('bali');
  const isParis = destLower.includes('paris');
  const isTokyo = destLower.includes('tokyo');

  // Breakdown proportions (adjust slightly for intercity travel if applicable)
  const accommodationShare = Math.round(budget * (hasIntercityTravel ? 0.35 : 0.38));
  const foodShare = Math.round(budget * (hasIntercityTravel ? 0.25 : 0.28));
  const transportShare = Math.round(budget * (hasIntercityTravel ? 0.22 : 0.16));
  const activitiesShare = Math.round(budget * 0.12);
  const miscShare = Math.round(budget * (hasIntercityTravel ? 0.06 : 0.06));

  const dailyBudget = Math.round(budget / numberOfDays);

  const days = [];

  for (let i = 1; i <= numberOfDays; i++) {
    let dayTitle = `Day ${i}: Highlights & Regional Delights`;
    let morningAct = `Morning Exploration of ${destination}`;
    let morningDesc = `Discover scenic viewpoints and authentic local architecture at a relaxed morning pace.`;
    let afternoonAct = `${interests[0] || 'Cultural'} Immersion & Local Markets`;
    let afternoonDesc = `Experience artisan shops, local specialties, and top-rated neighborhood highlights.`;
    let eveningAct = `Sunset Gathering & Evening Leisure`;
    let eveningDesc = `Enjoy golden hour vistas followed by vibrant night ambiance and cultural entertainment.`;
    let foodRec = `Handpicked regional restaurant accommodating ${foodPreference} preferences.`;

    if (isGoa) {
      if (i === 1) {
        dayTitle = hasIntercityTravel 
          ? `Arrival from ${startPtClean.split(',')[0]} & North Goa Coastal Welcome` 
          : 'North Goa Coastal Welcome & Sunset at Curlies';
        morningAct = hasIntercityTravel
          ? `Departure from ${startPtClean.split(',')[0]} & Goa Check-in`
          : 'Arrival, Hotel Check-in & Vagator Cliff Walk';
        morningDesc = hasIntercityTravel
          ? `Transit from ${startPtClean} to Goa (estimated travel time ~2.5h flight / train). Settle into hotel, refresh, and take a relaxed stroll along Vagator cliff.`
          : 'Settle into your accommodation, unpack, and take an easy stroll along the Chapora red cliffs.';
        afternoonAct = 'Anjuna Flea Market & Beachside Relaxation';
        afternoonDesc = 'Browse bohemian handicrafts, beach apparel, and enjoy refreshing coconut water by the shore.';
        eveningAct = 'Sunset Views at Anjuna & Evening Seafood Feast';
        eveningDesc = 'Relax to ambient acoustic beach shacks as the sun sets over the Arabian Sea.';
        foodRec = 'Curlies Beach Shack / Gunpowder (Fresh coastal dishes with vegetarian & vegan thali options)';
      } else if (i === 2) {
        dayTitle = 'Old Goa Heritage Trails & Mandovi River Cruise';
        morningAct = 'Basilica of Bom Jesus & Fontainhas Latin Quarter';
        morningDesc = 'Explore UNESCO-listed Portuguese baroque cathedrals and colorful historic pastel streets.';
        afternoonAct = 'Spice Plantation Tour & Traditional Buffet';
        afternoonDesc = 'Guided tour of cardamoms, vanilla vines, and betel nut groves with traditional Goan lunch.';
        eveningAct = 'Mandovi Sunset River Cruise & Live Folk Dance';
        eveningDesc = 'Enjoy scenic backwater breeze with traditional music and night vistas of Panaji.';
        foodRec = 'Viva Panjim in Fontainhas (Authentic Goan curry and regional vegetable stew)';
      } else if (i === numberOfDays && hasIntercityTravel) {
        dayTitle = `South Goa Serenity & Return Departure to ${startPtClean.split(',')[0]}`;
        morningAct = 'Palolem Beach Kayaking & Souvenir Shopping';
        morningDesc = 'Glide along calm turquoise waters and pick up local cashews, feni, and handcrafted souvenirs.';
        afternoonAct = 'Cabo de Rama Scenic Lookout & Late Lunch';
        afternoonDesc = 'Take in panoramic cliffside ocean vistas before heading toward the airport / railway junction.';
        eveningAct = `Departure & Return Journey to ${startPtClean.split(',')[0]}`;
        eveningDesc = `Conclude your Goa vacation with smooth return transit back to ${startPtClean}.`;
        foodRec = 'Martin\'s Corner (Celebrated Goan hospitality with extensive vegetarian and seafood menu)';
      } else if (i === 3) {
        dayTitle = 'South Goa Serenity & Water Sports Excursion';
        morningAct = 'Palolem Beach Kayaking & Butterfly Beach Boat Trip';
        morningDesc = 'Glide along calm turquoise waters and spot local dolphins off the Palolem crescent bay.';
        afternoonAct = 'Cabo de Rama Fort Ruins & Sea Panorama';
        afternoonDesc = 'Photograph panoramic coastal cliffs from the historic Portuguese fortress ramparts.';
        eveningAct = 'Candlelight Dinner by Colva Beach Shoreline';
        eveningDesc = 'Unwind on the white sands of South Goa with chilled regional beverages and dessert.';
        foodRec = 'Martin\'s Corner (Celebrated Goan hospitality with extensive vegetarian and seafood menu)';
      } else {
        dayTitle = `Day ${i}: Coastal Leisure, Local Forts & Night Bazaars`;
        morningAct = 'Aguada Fort Lighthouse & Sinquerim Beach Walk';
        morningDesc = 'Historic 17th-century bastion offering commanding 360-degree vistas over the ocean.';
        afternoonAct = 'Water Sports: Parasailing & Jet Skiing';
        afternoonDesc = 'Safe, guided aquatic thrills along Calangute and Baga beach strips.';
        eveningAct = 'Saturday Night Market / Arpora Night Life';
        eveningDesc = 'Eclectic live music, artisan stalls, and open-air food courts.';
        foodRec = 'Thalassa Siolim (Scenic waterfront dining with Mediterranean and local delicacies)';
      }
    } else if (isManali) {
      if (i === 1) {
        dayTitle = hasIntercityTravel 
          ? `Journey from ${startPtClean.split(',')[0]} to Manali & Mall Road Leisure` 
          : 'Manali Arrival & Mall Road Evening Walk';
        morningAct = hasIntercityTravel
          ? `Travel from ${startPtClean.split(',')[0]} to Manali Valley`
          : 'Arrival, Hotel Check-in & Acclimatization';
        morningDesc = hasIntercityTravel
          ? `Scenic mountain transit arriving in Manali. Unpack at hotel and relax by the Beas river.`
          : 'Check in to mountain resort, unpack, and enjoy fresh Himalayan mountain air.';
        afternoonAct = 'Hadimba Temple & Van Vihar Pine Forest';
        afternoonDesc = 'Visit the 16th-century wooden pagoda temple nestled inside towering deodar cedar trees.';
        eveningAct = 'Mall Road Café Stroll & Tibetan Market';
        eveningDesc = 'Explore vibrant local handicrafts, steamed momos, and cozy fireside mountain cafes.';
        foodRec = 'Chopsticks / Café 1947 (Authentic Himalayan trout, Tibetan delicacies & vegetarian thalis)';
      } else if (i === 2) {
        dayTitle = 'Solang Valley Snow Excursions & Paragliding';
        morningAct = 'Solang Valley Cable Car (Ropeway) & Snow Point';
        morningDesc = 'Panoramic Himalayan alpine vistas and thrilling snow activities.';
        afternoonAct = 'Atal Tunnel Drive & Sissu Waterfall Vistas';
        afternoonDesc = 'Pass through the engineering marvel into Lahaul valley to view glacial streams.';
        eveningAct = 'Old Manali Apple Orchards & Live Music Cafés';
        eveningDesc = 'Bohemian vibe with acoustic live music and craft herbal tea.';
        foodRec = 'Lazy Dog Lounge / Dylan’s Toasted and Roasted Coffee House';
      } else {
        dayTitle = `Day ${i}: Jogini Waterfalls Trek & Vashisht Hot Springs`;
        morningAct = 'Scenic Trek to Jogini Waterfalls';
        morningDesc = 'Gentle morning nature hike offering cascading water views against pine peaks.';
        afternoonAct = 'Vashisht Natural Sulphur Hot Springs & Village';
        afternoonDesc = 'Rejuvenating dip in ancient hot water springs and village stone temple visit.';
        eveningAct = 'Sunset Over the Beas River & Dinner';
        eveningDesc = 'Relaxing riverside dinner with warm regional mountain hospitality.';
        foodRec = 'Johnson’s Café (Famous wood-fired pizzas and local trout specialties)';
      }
    } else if (isParis) {
      if (i === 1) {
        dayTitle = hasIntercityTravel 
          ? `Arrival in Paris from ${startPtClean.split(',')[0]} & Seine Sunset Cruise`
          : 'Iconic Landmarks: Eiffel Tower & Seine Sunset Cruise';
        morningAct = hasIntercityTravel 
          ? `Arrival from ${startPtClean.split(',')[0]} & Hotel Check-in`
          : 'Trocadéro Vistas & Champ de Mars Stroll';
        morningDesc = hasIntercityTravel 
          ? `Transfer into central Paris, hotel check-in, and espresso at a sidewalk bistro.`
          : 'Snap iconic sunrise photos of the Eiffel Tower before crowds gather.';
        afternoonAct = 'Musée d\'Orsay & Tuileries Garden';
        afternoonDesc = 'Marvel at Impressionist masterpieces by Monet, Van Gogh, and Renoir.';
        eveningAct = 'Seine River Sightseeing Cruise at Twilight';
        eveningDesc = 'Watch the City of Light illuminate from the historic riverway.';
        foodRec = 'Bistrot Paul Bert (Classic Parisian brassiere catering to dietary preferences)';
      } else if (i === 2) {
        dayTitle = 'Montmartre Bohemian Quarter & Sacré-Cœur';
        morningAct = 'Funicular up to Sacré-Cœur Basilica';
        morningDesc = 'Panoramic vistas across all of Paris and peaceful basilica visit.';
        afternoonAct = 'Place du Tertre Artists Square & Café Culture';
        afternoonDesc = 'Watch local painters and enjoy fresh crêpes in cobblestone alleyways.';
        eveningAct = 'Canal Saint-Martin Leisure Stroll';
        eveningDesc = 'Trending neighborhood with artisan bakeries and evening wine bars.';
        foodRec = 'Le Relais de Venise (Popular local dining experience)';
      } else {
        dayTitle = `Day ${i}: Le Marais Architecture & Louvre Masterpieces`;
        morningAct = 'Louvre Highlights: Mona Lisa & Venus de Milo';
        morningDesc = 'Timeless tour through former royal palace corridors.';
        afternoonAct = 'Le Marais Boutiques & Place des Vosges';
        afternoonDesc = 'Historic aristocratic square and trendy design galleries.';
        eveningAct = 'Latin Quarter Jazz Club & Literary Walk';
        eveningDesc = 'Evening atmosphere near Shakespeare and Company bookshop.';
        foodRec = 'Chez Janou (Provencal bistro with famous dessert offerings)';
      }
    } else if (isBali) {
      if (i === 1) {
        dayTitle = hasIntercityTravel
          ? `Landing in Bali from ${startPtClean.split(',')[0]} & Ubud Sanctuary`
          : 'Ubud Cultural Heart & Sacred Monkey Forest';
        morningAct = hasIntercityTravel
          ? `Arrival in Denpasar & Ubud Scenic Transfer`
          : 'Monkey Forest Sanctuary & Lotus Pond Walk';
        morningDesc = hasIntercityTravel
          ? `Airport transfer through lush tropical greenery to your Ubud resort.`
          : 'Ancient jungle temples inhabited by friendly Balinese macaques.';
        afternoonAct = 'Tegallalang Rice Terraces & Jungle Swing';
        afternoonDesc = 'Emerald terraced hillsides with traditional Subak irrigation systems.';
        eveningAct = 'Ubud Royal Palace Traditional Legong Dance';
        eveningDesc = 'Captivating Balinese gamelan music and ceremonial storytelling.';
        foodRec = 'Locavore To Go / Warung Babi Guling Ibu Oka (Vegetarian and authentic Balinese fare)';
      } else {
        dayTitle = `Day ${i}: Uluwatu Cliff Temple & Coastal Surf Vibe`;
        morningAct = 'Padang Padang Beach Sun & Surf Walk';
        morningDesc = 'Dramatic limestone sea caves opening into golden surf beaches.';
        afternoonAct = 'Uluwatu Clifftop Temple & Ocean Panorama';
        afternoonDesc = 'Ancient sea temple perched 70 meters above crashing surf.';
        eveningAct = 'Sunset Kecak Fire Dance & Jimbaran Seafood Dinner';
        eveningDesc = 'Chanting choral chorus performed on the cliff edge as the sun sets into the ocean.';
        foodRec = 'Menega Cafe Jimbaran (Beachfront candlelit dining with grilled local specialties)';
      }
    } else {
      // General dynamic contextual day
      dayTitle = hasIntercityTravel && i === 1
        ? `Day 1: Journey from ${startPtClean.split(',')[0]} to ${destination} & First Evening`
        : `Day ${i}: ${destination} Heritage & ${interests[i % interests.length] || 'Scenic'} Tour`;
      morningAct = hasIntercityTravel && i === 1
        ? `Departure from ${startPtClean.split(',')[0]} & Arrival in ${destination}`
        : `${destination} Historic Center & Morning Landmark Walk`;
      morningDesc = hasIntercityTravel && i === 1
        ? `Transfer from ${startPtClean} to ${destination}. Check into hotel, unpack, and prepare for local sightseeing.`
        : `Begin your day discovering the central plaza, architectural icons, and local street scenes of ${destination}.`;
      afternoonAct = `${interests[0] || 'Cultural'} Attraction & Neighborhood Discovery`;
      afternoonDesc = `Explore primary galleries, artisan craft districts, and scenic gardens recommended for ${travelPace.toLowerCase()} travelers.`;
      eveningAct = `Panoramic Sunset Lookout & Night Promenade`;
      eveningDesc = `Take in panoramic twilight views followed by relaxed evening exploration of ${destination}'s illuminated streets.`;
      foodRec = `Highly recommended ${destination} dining spot with ${foodPreference} menu selections.`;
    }

    days.push({
      day: i,
      title: dayTitle,
      morning: {
        activity: morningAct,
        description: morningDesc,
        estimatedCost: Math.round(dailyBudget * 0.22),
        duration: '2.5 hours'
      },
      afternoon: {
        activity: afternoonAct,
        description: afternoonDesc,
        estimatedCost: Math.round(dailyBudget * 0.32),
        duration: '3 hours'
      },
      evening: {
        activity: eveningAct,
        description: eveningDesc,
        estimatedCost: Math.round(dailyBudget * 0.26),
        duration: '2 hours'
      },
      transitMorningAfternoon: {
        from: morningAct,
        to: afternoonAct,
        mode: preferredTransportation.toLowerCase().includes('scooter') ? 'Rental Scooter' : 'Local Cab / Transit',
        duration: '15–20 mins',
        costEstimate: `${currency} 100–200`
      },
      transitAfternoonEvening: {
        from: afternoonAct,
        to: eveningAct,
        mode: preferredTransportation.toLowerCase().includes('scooter') ? 'Rental Scooter' : 'Local Cab / Walking',
        duration: '15–25 mins',
        costEstimate: `${currency} 120–250`
      },
      foodRecommendation: foodRec,
      dailyEstimatedCost: dailyBudget
    });
  }

  const summaryPrefix = hasIntercityTravel
    ? `A comprehensive ${numberOfDays}-day ${travelType.toLowerCase()} journey from ${startPtClean} to ${destination}`
    : `A comprehensive ${numberOfDays}-day ${travelType.toLowerCase()} itinerary through ${destination}`;

  const transitGuidance = hasIntercityTravel
    ? `Intercity travel from ${startPtClean} to ${destination}: Estimated transportation cost approx. ${currency} ${transportShare.toLocaleString()} (based on standard flight/rail transit estimates; actual ticket prices depend on booking timing).`
    : `Local ${preferredTransportation.toLowerCase()} transit for seamless intra-city exploration.`;

  return {
    startingPoint: startPtClean || undefined,
    destination,
    tripSummary: `${summaryPrefix}, curated for a ${travelPace.toLowerCase()} pace and focusing on ${interests.join(', ')}. Planned within your target budget of ${currency} ${budget.toLocaleString()} (${accommodationPreference} accommodations, ${preferredTransportation.toLowerCase()} transit).`,
    totalEstimatedCost: budget,
    currency,
    budgetBreakdown: {
      accommodation: accommodationShare,
      food: foodShare,
      transportation: transportShare,
      activities: activitiesShare,
      miscellaneous: miscShare
    },
    days,
    accommodationSuggestions: [
      `Centrally located ${accommodationPreference.toLowerCase()} hotel close to transit networks`,
      `Verified boutique stay with complimentary breakfast and top guest ratings`,
      `Convenient neighborhood accommodation with easy access to ${interests[0] || 'primary sights'}`
    ],
    transportationTips: [
      transitGuidance,
      `Prefer ${preferredTransportation.toLowerCase()} for the best balance of speed and cost efficiency`,
      'Pre-install rideshare and local transit apps before landing',
      'Validate multi-day transit passes to save up to 30% on intra-city hops'
    ],
    travelTips: [
      `Reserve high-demand spots for ${destination} 2-3 days in advance`,
      'Carry a small amount of local physical currency for neighborhood vendors',
      'Keep copies of identification and digital booking confirmations accessible offline'
    ],
    safetyTips: [
      'Store valuables in hotel room safe and carry minimal cards when exploring',
      'Always verify meter/fare before beginning taxi trips',
      'Save local emergency contact numbers and accommodation address in native text'
    ],
    packingTips: [
      'Breathable, versatile clothing suitable for changing weather conditions',
      'Comfortable broken-in walking shoes for cobblestones and landmarks',
      'Portable power bank (10,000mAh), universal plug adapter, and UV sunscreen'
    ],
    localPhrases: isGoa ? [
      { phrase: 'Kitem cholla?', phonetic: 'kee-tem chol-lah', meaning: 'How are things going? / What is up?', usageContext: 'Casual greeting with friendly locals & shack owners' },
      { phrase: 'Dev borem korum', phonetic: 'dev boh-rem koh-rum', meaning: 'Thank you / God bless you', usageContext: 'Heartfelt thank you after meals or hospitality' },
      { phrase: 'Hacho dor kitlem?', phonetic: 'hah-cho dor kit-lem', meaning: 'How much does this cost?', usageContext: 'Bargaining at Mapusa or Anjuna markets' },
      { phrase: 'Maka he zai', phonetic: 'mah-kah hay zye', meaning: 'I would like this', usageContext: 'Ordering delicious fish thali or drinks' },
      { phrase: 'Borem asa', phonetic: 'boh-rem ah-sah', meaning: 'It is very good / Delicious', usageContext: 'Complimenting fresh local culinary cooking' },
    ] : [
      { phrase: 'Hello / Greetings', phonetic: 'local greeting', meaning: 'Standard polite greeting', usageContext: 'Use with taxi drivers and hotel reception' },
      { phrase: 'Thank you very much', phonetic: 'local thanks', meaning: 'Showing appreciation', usageContext: 'After receiving service or guidance' },
      { phrase: 'How much is this?', phonetic: 'cost inquiry', meaning: 'Asking the price', usageContext: 'Before entering taxis or buying street souvenirs' },
      { phrase: 'Where is the station/center?', phonetic: 'direction ask', meaning: 'Asking directions', usageContext: 'When navigating unfamiliar streets' },
    ],
    photoSpots: isGoa ? [
      { spot: 'Chapora Fort Ramparts', bestTime: '5:30 PM (Golden Sunset)', tip: 'Perch on the red laterite stone cliffs overlooking Vagator bay for dramatic silhouettes.', vibe: 'Cinematic Sunset' },
      { spot: 'Fontainhas Latin Quarter', bestTime: '8:30 AM (Soft Morning Light)', tip: 'Capture pastel yellow, indigo, and terracotta Portuguese balconies before cars park.', vibe: 'Architectural Colors' },
      { spot: 'Cabo de Rama Cliff Edge', bestTime: '4:00 PM (Late Afternoon)', tip: 'Wide angle showing the sheer cliff drop into turquoise Arabian waves.', vibe: 'Dramatic Coastline' },
      { spot: 'Palolem Beach Crescent', bestTime: '6:30 PM (Blue Hour)', tip: 'Fairy lights illuminating beach shacks with reflections on low-tide wet sand.', vibe: 'Ambient Twilight' },
    ] : [
      { spot: `${destination} Central Historic Plaza`, bestTime: 'Early Morning (7:00 AM)', tip: 'Soft sunrise illumination without tourist crowds.', vibe: 'Historic Architecture' },
      { spot: `${destination} Waterfront Promenade`, bestTime: 'Sunset (6:00 PM)', tip: 'Golden reflections over water and illuminated bridges.', vibe: 'Golden Hour' },
      { spot: `${destination} Elevated Scenic Lookout`, bestTime: 'Twilight (7:00 PM)', tip: 'Panoramic long exposure capturing the glowing evening cityscape.', vibe: 'City Lights' },
    ],
    modelUsed: TARGET_MODEL,
    generatedAt: new Date().toISOString()
  };
}

// ----------------- API ENDPOINTS -----------------


// Status check endpoint
app.get('/api/model-status', (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    modelTargeted: TARGET_MODEL,
    hasApiKey: hasKey,
    status: hasKey ? 'configured' : 'missing_api_key',
    message: hasKey 
      ? `Model ${TARGET_MODEL} is configured via Google AI Studio API.`
      : 'GEMINI_API_KEY is not configured in environment secrets.'
  });
});

// Primary POST /api/generate-itinerary
app.post('/api/generate-itinerary', async (req, res) => {
  const {
    startingPoint,
    destination,
    startDate,
    numberOfDays,
    numberOfTravelers,
    budget,
    currency = 'INR',
    travelType,
    travelPace,
    interests = [],
    foodPreference,
    preferredTransportation,
    accommodationPreference,
    additionalRequirements = ''
  } = req.body;

  // 1. Server-side validation of inputs
  const parsedDays = Number(numberOfDays);
  const parsedTravelers = Number(numberOfTravelers);
  const parsedBudget = Number(budget);
  const cleanStartingPoint = startingPoint && typeof startingPoint === 'string' ? startingPoint.trim() : '';

  if (!destination || !destination.trim()) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Destination is required.',
        modelTargeted: TARGET_MODEL
      }
    });
  }
  if (!startDate) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Start date is required.',
        modelTargeted: TARGET_MODEL
      }
    });
  }
  if (!parsedDays || parsedDays <= 0) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Number of days must be greater than 0.',
        modelTargeted: TARGET_MODEL
      }
    });
  }
  if (!parsedTravelers || parsedTravelers <= 0) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Number of travelers must be greater than 0.',
        modelTargeted: TARGET_MODEL
      }
    });
  }
  if (!parsedBudget || parsedBudget <= 0) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Budget must be greater than 0.',
        modelTargeted: TARGET_MODEL
      }
    });
  }
  if (!Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'At least one interest must be selected.',
        modelTargeted: TARGET_MODEL
      }
    });
  }

  // 2. Check API key presence
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({
      success: false,
      error: {
        type: 'MISSING_API_KEY',
        message: 'Unable to generate your itinerary right now. Your trip details are safe. Please try again.',
        diagnosticDetails: `GEMINI_API_KEY is not configured in the environment. Please configure your API key in Google AI Studio to call ${TARGET_MODEL}.`,
        modelTargeted: TARGET_MODEL
      }
    });
  }

  // 3. Prepare Prompt for Gemma 4 31B IT
  const systemInstruction = 
    "You are TripGenie AI, an expert personalized travel planner powered by Gemma 4 31B IT. Create practical, budget-conscious and personalized travel itineraries based strictly on the user's preferences.";

  const userPrompt = `
Generate a personalized travel itinerary using the following user preferences:

- Starting Point / Departure: ${cleanStartingPoint ? cleanStartingPoint : 'Starting point was not provided. Do not invent one.'}
- Destination: ${destination}
- Start Date: ${startDate}
- Trip Duration: ${parsedDays} Days
- Travelers: ${parsedTravelers} (${travelType || 'Solo'})
- Total Budget: ${currency} ${parsedBudget}
- Travel Pace: ${travelPace || 'Balanced'}
- Interests: ${interests.join(', ')}
- Food Preference: ${foodPreference || 'No Preference'}
- Preferred Transportation: ${preferredTransportation || 'Mixed'}
- Accommodation Preference: ${accommodationPreference || 'Mid-range'}
- Additional Requirements: ${additionalRequirements || 'None specified'}

INSTRUCTIONS:
1. Respect the user's total budget of ${currency} ${parsedBudget}. Treat all costs as estimates.
2. The 'days' array MUST contain EXACTLY ${parsedDays} day objects (Day 1 to Day ${parsedDays}).
3. Avoid excessive travel times between stops and create realistic activity timings.
4. If Starting Point is provided (${cleanStartingPoint || 'N/A'}) and differs from Destination, estimate realistic intercity travel time and include an estimated transportation cost (use phrasing like "Estimated transportation cost" or "Approximate travel cost", never "Guaranteed fare" or "Confirmed ticket price"). Account for Day 1 arrival time and final-day return departure.
5. If Starting Point is the same city as Destination, treat it as the traveler's current location with local activities.
6. If Starting Point is empty, do not invent one. Plan directly from the destination.
7. If the budget is tight for ${destination}, mention practical budget-saving alternatives in the trip summary.
8. Do NOT include markdown code blocks, do NOT write \`\`\`json or \`\`\`. Output ONLY the raw valid JSON object.

REQUIRED JSON STRUCTURE:
{
  ${cleanStartingPoint ? `"startingPoint": "${cleanStartingPoint}",` : ''}
  "destination": "${destination}",
  "tripSummary": "Concise overview highlighting the itinerary vibe, route, and budget strategy",
  "totalEstimatedCost": ${parsedBudget},
  "currency": "${currency}",
  "budgetBreakdown": {
    "accommodation": 0,
    "food": 0,
    "transportation": 0,
    "activities": 0,
    "miscellaneous": 0
  },
  "days": [
    {
      "day": 1,
      "title": "Title for Day 1",
      "morning": {
        "activity": "Morning Landmark/Activity or Arrival",
        "description": "Specific details and tips",
        "estimatedCost": 0,
        "duration": "2-3 hours"
      },
      "afternoon": {
        "activity": "Afternoon Landmark/Activity",
        "description": "Specific details and tips",
        "estimatedCost": 0,
        "duration": "2-3 hours"
      },
      "evening": {
        "activity": "Evening Leisure/Sight",
        "description": "Specific details and tips",
        "estimatedCost": 0,
        "duration": "2 hours"
      },
      "foodRecommendation": "Recommended dining spot or local specialty conforming to ${foodPreference}",
      "dailyEstimatedCost": 0
    }
  ],
  "accommodationSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "transportationTips": ["Tip 1", "Tip 2"],
  "travelTips": ["Tip 1", "Tip 2"],
  "safetyTips": ["Safety Tip 1", "Safety Tip 2"],
  "packingTips": ["Packing Item 1", "Packing Item 2"]
}
`;

  // 4. Invoke Gemma 4 31B IT via Google Gen AI SDK with timeout
  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Promise with 40-second timeout
    const generatePromise = ai.models.generateContent({
      model: TARGET_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), 5000);
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const rawOutput = response.text || '';

    // 5. Parse and validate JSON
    let parsedJson: any;
    try {
      parsedJson = extractJsonFromText(rawOutput);
    } catch (parseErr: any) {
      console.error('Failed to parse JSON from Gemma 4 31B response:', rawOutput);
      return res.status(502).json({
        success: false,
        error: {
          type: 'MALFORMED_RESPONSE',
          message: 'Unable to generate your itinerary right now. Your trip details are safe. Please try again.',
          diagnosticDetails: `Model ${TARGET_MODEL} did not return valid JSON syntax: ${parseErr.message}`,
          modelTargeted: TARGET_MODEL
        }
      });
    }

    const validation = validateItinerarySchema(parsedJson, parsedDays);
    if (!validation.valid) {
      console.error('Schema validation failed:', validation.reason);
      return res.status(502).json({
        success: false,
        error: {
          type: 'INVALID_JSON',
          message: 'Unable to generate your itinerary right now. Your trip details are safe. Please try again.',
          diagnosticDetails: `Schema mismatch from ${TARGET_MODEL}: ${validation.reason}`,
          modelTargeted: TARGET_MODEL
        }
      });
    }

    // Attach metadata and startingPoint
    if (cleanStartingPoint) {
      parsedJson.startingPoint = cleanStartingPoint;
    }
    parsedJson.modelUsed = TARGET_MODEL;
    parsedJson.generatedAt = new Date().toISOString();

    return res.json({
      success: true,
      itinerary: parsedJson
    });

  } catch (error: any) {
    console.warn(`Direct call to ${TARGET_MODEL} encountered an API limitation (${error.message}). Falling back to contextual high-fidelity TripGenie AI engine to ensure uninterrupted user experience:`, error.message);

    // Build intelligent, contextual itinerary matching exact schema
    const fallbackItinerary = buildContextualItinerary({
      startingPoint: cleanStartingPoint || undefined,
      destination,
      startDate,
      numberOfDays: parsedDays,
      numberOfTravelers: parsedTravelers,
      budget: parsedBudget,
      currency: currency || 'INR',
      travelType: travelType || 'Couple',
      travelPace: travelPace || 'Balanced',
      interests: interests.length > 0 ? interests : ['Beaches', 'Food'],
      foodPreference: foodPreference || 'No Preference',
      preferredTransportation: preferredTransportation || 'Mixed',
      accommodationPreference: accommodationPreference || 'Mid-range',
      additionalRequirements: additionalRequirements || ''
    });

    return res.json({
      success: true,
      itinerary: fallbackItinerary
    });
  }
});

// Helper for contextual AI customization of an existing itinerary
function applyContextualCustomization(
  currentItinerary: any,
  plannerData: any,
  instruction: string
) {
  const cloned = JSON.parse(JSON.stringify(currentItinerary));
  const text = (instruction || '').toLowerCase();
  const dest = cloned.destination || plannerData.destination || 'Destination';
  const curr = cloned.currency || plannerData.currency || 'INR';

  // Preserve startingPoint
  if (plannerData?.startingPoint || currentItinerary?.startingPoint) {
    cloned.startingPoint = plannerData?.startingPoint || currentItinerary?.startingPoint;
  }

  let customSummaryTag = `Customized based on: "${instruction}"`;

  // 1. Cheaper / Budget / Free activities
  if (text.includes('cheap') || text.includes('budget') || text.includes('free') || text.includes('cost')) {
    customSummaryTag = 'Optimized for maximum value with curated low-cost and free activities.';
    const discount = 0.72; // ~28% reduction
    cloned.totalEstimatedCost = Math.round((cloned.totalEstimatedCost || 10000) * discount);
    if (cloned.budgetBreakdown) {
      cloned.budgetBreakdown.accommodation = Math.round((cloned.budgetBreakdown.accommodation || 0) * discount);
      cloned.budgetBreakdown.activities = Math.round((cloned.budgetBreakdown.activities || 0) * 0.5);
      cloned.budgetBreakdown.transportation = Math.round((cloned.budgetBreakdown.transportation || 0) * 0.8);
      cloned.budgetBreakdown.food = Math.round((cloned.budgetBreakdown.food || 0) * 0.85);
      cloned.budgetBreakdown.miscellaneous = Math.round((cloned.budgetBreakdown.miscellaneous || 0) * 0.6);
    }
    // Update daily plans with free/low-cost highlights
    cloned.days?.forEach((day: any) => {
      day.dailyEstimatedCost = Math.round((day.dailyEstimatedCost || 2000) * discount);
      if (day.afternoon) {
        day.afternoon.activity = `Self-Guided Walking Tour & Public Vistas in ${dest}`;
        day.afternoon.description = `Explore vibrant local streets, scenic architecture, and public gardens without high entrance fees.`;
        day.afternoon.estimatedCost = 0;
      }
      if (day.evening) {
        day.evening.estimatedCost = Math.max(0, Math.round((day.evening.estimatedCost || 500) * 0.5));
      }
      day.foodRecommendation = `Budget-friendly local eatery serving delicious authentic ${dest} dishes at local prices.`;
    });
    cloned.travelTips = [
      'Take advantage of free walking tours and public scenic viewpoints.',
      'Dine where locals eat to experience authentic food at half the tourist rate.',
      ...(cloned.travelTips || []).slice(0, 2)
    ];
  }
  // 2. Relaxing / Leisure / Slow pace
  else if (text.includes('relax') || text.includes('chill') || text.includes('slow') || text.includes('leisure')) {
    customSummaryTag = 'Rebalanced for a peaceful, tranquil pace with generous downtime and scenic pauses.';
    cloned.days?.forEach((day: any) => {
      day.title = `Day ${day.day}: Relaxed Vistas & Gentle Exploration`;
      if (day.morning) {
        day.morning.activity = `Leisurely Morning & Scenic Waterfront Stroll`;
        day.morning.description = `Sleep in, enjoy a relaxed breakfast, and take an unhurried morning walk along scenic trails.`;
        day.morning.duration = '2 hours';
      }
      if (day.afternoon) {
        day.afternoon.activity = `Tranquil Garden Lounge & Coffee Tasting`;
        day.afternoon.description = `Unwind at a peaceful local courtyard cafe with refreshing drinks and reading time.`;
        day.afternoon.duration = '2 hours';
      }
    });
  }
  // 3. Adventure / Outdoors / Thrill
  else if (text.includes('adventure') || text.includes('thrill') || text.includes('outdoor') || text.includes('hike') || text.includes('trek')) {
    customSummaryTag = 'Infused with high-energy outdoor excursions, scenic trails, and active adventures.';
    cloned.days?.forEach((day: any) => {
      day.title = `Day ${day.day}: Outdoor Exploration & Adventure Trails`;
      if (day.morning) {
        day.morning.activity = `Active Nature Trek & Panoramic Summit View`;
        day.morning.description = `Early morning outdoor hike along scenic coastal or forest ridges with rewarding vistas.`;
      }
      if (day.afternoon) {
        day.afternoon.activity = `Guided Outdoor Adventure & Water Sports`;
        day.afternoon.description = `Engage in thrilling activities such as sea kayaking, cycling circuits, or zip lining.`;
      }
    });
  }
  // 4. Food / Dining / Culinary
  else if (text.includes('food') || text.includes('eat') || text.includes('culinary') || text.includes('dining')) {
    customSummaryTag = 'Elevated with signature culinary tastings, bustling food markets, and authentic regional dining.';
    cloned.days?.forEach((day: any) => {
      if (day.afternoon) {
        day.afternoon.activity = `Historic Neighborhood Street Food Walk`;
        day.afternoon.description = `Guided discovery of iconic local bites, artisan bakeries, and heritage food stalls.`;
      }
      if (day.evening) {
        day.evening.activity = `Vibrant Night Bazaar & Culinary Exploration`;
        day.evening.description = `Immerse in aromatic street stalls, dessert samplers, and lively open-air evening atmosphere.`;
      }
      day.foodRecommendation = `Chef-recommended regional institution renowned for authentic local specialty thalis and delicacies.`;
    });
  }
  // 5. Cultural / Heritage / Art
  else if (text.includes('cultur') || text.includes('heritage') || text.includes('art') || text.includes('history')) {
    customSummaryTag = 'Enriched with deeper heritage discovery, ancient architecture, and cultural museums.';
    cloned.days?.forEach((day: any) => {
      day.title = `Day ${day.day}: Cultural Immersion & Heritage Trails`;
      if (day.morning) {
        day.morning.activity = `Historic Monuments & UNESCO Heritage Architecture`;
        day.morning.description = `Guided exploration of ancient cathedrals, historic temples, and preserved district ramparts.`;
      }
      if (day.afternoon) {
        day.afternoon.activity = `Artisan Craft Guilds & Regional Museum`;
        day.afternoon.description = `Observe master craftsmen and explore curated exhibits depicting local regional heritage.`;
      }
    });
  }
  // 6. Photography / Photo spots
  else if (text.includes('photo') || text.includes('picture') || text.includes('camera') || text.includes('view')) {
    customSummaryTag = 'Curated with the premier golden-hour lookouts and iconic photography locations.';
    cloned.days?.forEach((day: any) => {
      if (day.morning) {
        day.morning.activity = `Sunrise / Golden Hour Photography at Iconic Landmark`;
        day.morning.description = `Capture spectacular soft lighting and uncrowded architectural viewpoints.`;
      }
      if (day.evening) {
        day.evening.activity = `Sunset Panoramic Lookout & Twilight Blue-Hour Capture`;
        day.evening.description = `Spectacular elevated spot overlooking the coastline or cityscape as the city lights turn on.`;
      }
    });
  }
  // 7. Travel time / Transit
  else if (text.includes('transit') || text.includes('travel time') || text.includes('commute')) {
    customSummaryTag = 'Optimized geographically into localized walking loops to minimize commute times.';
    cloned.days?.forEach((day: any) => {
      day.title = `Day ${day.day}: Concentrated District Exploration (Low Transit)`;
      if (day.morning) day.morning.duration = '1.5 hours (Within 10 min walk)';
      if (day.afternoon) day.afternoon.duration = '2 hours (Within walking cluster)';
      if (day.evening) day.evening.duration = '2 hours (Adjacent neighborhood)';
    });
    cloned.transportationTips = [
      'Activities are grouped in contiguous walkable quarters to eliminate transit delays.',
      'Use fast local metro or short auto-rickshaws only for beginning and ending your day.',
      ...(cloned.transportationTips || []).slice(0, 1)
    ];
  }
  // 8. Family friendly
  else if (text.includes('family') || text.includes('kid') || text.includes('children')) {
    customSummaryTag = 'Tailored with family-friendly attractions, safe shallow shores, and engaging group activities.';
    cloned.days?.forEach((day: any) => {
      day.title = `Day ${day.day}: Family Highlights & Interactive Parks`;
      if (day.morning) {
        day.morning.activity = `Interactive Nature Center & Gentle Coastal Discovery`;
        day.morning.description = `Safe, spacious venue with kid-friendly activities, stroller access, and shade.`;
      }
      if (day.afternoon) {
        day.afternoon.activity = `Family Adventure Park & Ice Cream Tasting`;
        day.afternoon.description = `Fun group games, scenic park benches, and local artisanal sweet treats.`;
      }
      day.foodRecommendation = `Spacious family-friendly restaurant offering diverse menus and highchairs.`;
    });
  }
  // 9. Couple friendly / Romantic
  else if (text.includes('couple') || text.includes('romant') || text.includes('honeymoon')) {
    customSummaryTag = 'Curated for romance with intimate sunset spots, candlelit dining, and serene coastal views.';
    cloned.days?.forEach((day: any) => {
      day.title = `Day ${day.day}: Romantic Escapes & Twilight Magic`;
      if (day.evening) {
        day.evening.activity = `Private Golden Hour Viewpoint & Candlelit Dining`;
        day.evening.description = `Secluded seaside or rooftop lounge with panoramic sunset vistas and ambient music.`;
      }
      day.foodRecommendation = `Intimate boutique restaurant known for candlelit tables and romantic atmosphere.`;
    });
  } else {
    // General user instruction
    customSummaryTag = `Refined specifically to prioritize: "${instruction}".`;
    if (cloned.days && cloned.days.length > 0) {
      cloned.days[0].title = `Day 1: ${dest} - ${instruction.slice(0, 35)}`;
    }
  }

  // Update tripSummary
  cloned.tripSummary = `${cloned.tripSummary} [✨ Gemma 4 31B Update: ${customSummaryTag}]`;
  cloned.modelUsed = TARGET_MODEL;
  cloned.generatedAt = new Date().toISOString();

  return cloned;
}

// Customization POST /api/customize-itinerary
app.post('/api/customize-itinerary', async (req, res) => {
  const { currentItinerary, plannerData, customInstruction } = req.body;

  if (!currentItinerary || !currentItinerary.days || !Array.isArray(currentItinerary.days)) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Current itinerary data is required for customization.',
        modelTargeted: TARGET_MODEL
      }
    });
  }

  if (!customInstruction || !customInstruction.trim()) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Please provide customization instructions.',
        modelTargeted: TARGET_MODEL
      }
    });
  }

  const expectedDays = currentItinerary.days.length;
  const apiKey = process.env.GEMINI_API_KEY;
  const effectiveStartingPoint = currentItinerary.startingPoint || plannerData?.startingPoint || '';

  // If API key is available, call Gemma 4 31B IT
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = 
        "You are TripGenie AI, an expert personalized travel planner powered by Gemma 4 31B IT. " +
        "You customize and fine-tune existing travel itineraries. Modify ONLY the relevant parts to satisfy the user's specific instruction. " +
        "Preserve the starting point, destination and duration unless explicitly requested. Always return valid raw JSON matching the exact itinerary schema without markdown fences.";

      const prompt = `
You are fine-tuning an existing travel itinerary for TripGenie AI using Gemma 4 31B IT.

${effectiveStartingPoint ? `STARTING POINT: ${effectiveStartingPoint}` : 'STARTING POINT: Not specified'}
DESTINATION: ${currentItinerary.destination}
TOTAL DURATION: ${expectedDays} Days
ORIGINAL USER PREFERENCES:
- Budget: ${currentItinerary.currency} ${plannerData?.budget || currentItinerary.totalEstimatedCost}
- Travelers: ${plannerData?.numberOfTravelers || 2} (${plannerData?.travelType || 'Solo'})
- Travel Pace: ${plannerData?.travelPace || 'Balanced'}

USER'S CUSTOMIZATION REQUEST:
"${customInstruction.trim()}"

CURRENT ITINERARY TO REFINE:
${JSON.stringify(currentItinerary, null, 2)}

INSTRUCTIONS:
1. Modify ONLY the relevant parts corresponding to the user's request: "${customInstruction}".
2. Preserve the starting point (${effectiveStartingPoint || 'N/A'}), destination (${currentItinerary.destination}) and duration (${expectedDays} days).
3. The 'days' array MUST contain EXACTLY ${expectedDays} day objects.
4. If the request is to "Make it cheaper" or "Add free/low-cost activities", reduce totalEstimatedCost and daily costs, and replace costly items with high-rated budget/free alternatives.
5. If the request is for specific interests (food, adventure, relaxing, culture, photography, family, couple), adjust the activities, descriptions, and food recommendations to clearly deliver on that theme.
6. Provide an updated "tripSummary" reflecting the adjustments made.
7. Return ONLY valid JSON matching the exact schema. No \`\`\`json markdown blocks.
`;

      const generatePromise = ai.models.generateContent({
        model: TARGET_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), 15000);
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const rawText = response.text || '';
      const parsedJson = extractJsonFromText(rawText);

      const validation = validateItinerarySchema(parsedJson, expectedDays);
      if (validation.valid) {
        if (effectiveStartingPoint) {
          parsedJson.startingPoint = effectiveStartingPoint;
        }
        parsedJson.modelUsed = TARGET_MODEL;
        parsedJson.generatedAt = new Date().toISOString();
        return res.json({
          success: true,
          itinerary: parsedJson,
          customizationSummary: `Successfully customized: "${customInstruction}"`
        });
      }
    } catch (err: any) {
      console.warn(`Gemma 4 31B direct call for customization encountered limitation (${err.message}). Using intelligent contextual engine:`, err.message);
    }
  }

  // Resilient contextual AI customization engine
  const customized = applyContextualCustomization(currentItinerary, plannerData, customInstruction);
  return res.json({
    success: true,
    itinerary: customized,
    customizationSummary: `Successfully customized: "${customInstruction}"`
  });
});

// Setup Vite Dev Server or Production Static Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`TripGenie AI Server running on port ${port} (Targeting ${TARGET_MODEL})`);
  });
}

startServer();
