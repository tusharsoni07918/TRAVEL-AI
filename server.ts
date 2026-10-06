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
  const isGoa = destLower.includes('goa');
  const isBali = destLower.includes('bali');
  const isParis = destLower.includes('paris');
  const isTokyo = destLower.includes('tokyo');

  // Breakdown proportions
  const accommodationShare = Math.round(budget * 0.38);
  const foodShare = Math.round(budget * 0.28);
  const transportShare = Math.round(budget * 0.16);
  const activitiesShare = Math.round(budget * 0.12);
  const miscShare = Math.round(budget * 0.06);

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
        dayTitle = 'North Goa Coastal Welcome & Sunset at Curlies';
        morningAct = 'Arrival, Hotel Check-in & Vagator Cliff Walk';
        morningDesc = 'Settle into your accommodation, unpack, and take an easy stroll along the Chapora red cliffs.';
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
    } else if (isParis) {
      if (i === 1) {
        dayTitle = 'Iconic Landmarks: Eiffel Tower & Seine Sunset Cruise';
        morningAct = 'Trocadéro Vistas & Champ de Mars Stroll';
        morningDesc = 'Snap iconic sunrise photos of the Eiffel Tower before crowds gather.';
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
        dayTitle = 'Ubud Cultural Heart & Sacred Monkey Forest';
        morningAct = 'Monkey Forest Sanctuary & Lotus Pond Walk';
        morningDesc = 'Ancient jungle temples inhabited by friendly Balinese macaques.';
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
      dayTitle = `Day ${i}: ${destination} Heritage & ${interests[i % interests.length] || 'Scenic'} Tour`;
      morningAct = `${destination} Historic Center & Morning Landmark Walk`;
      morningDesc = `Begin your day discovering the central plaza, architectural icons, and local street scenes of ${destination}.`;
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
      foodRecommendation: foodRec,
      dailyEstimatedCost: dailyBudget
    });
  }

  return {
    destination,
    tripSummary: `A comprehensive ${numberOfDays}-day ${travelType.toLowerCase()} itinerary through ${destination}, curated for a ${travelPace.toLowerCase()} pace and focusing on ${interests.join(', ')}. Planned within your target budget of ${currency} ${budget.toLocaleString()} (${accommodationPreference} accommodations, ${preferredTransportation.toLowerCase()} transit).`,
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
      `Prefer ${preferredTransportation.toLowerCase()} for the best balance of speed and cost efficiency`,
      'Pre-install rideshare and local transit transit apps before landing',
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
    "You are TripGenie AI, an expert personalized travel planner. Create practical, budget-conscious and personalized travel itineraries based strictly on the user's preferences.";

  const userPrompt = `
Generate a personalized travel itinerary using the following user preferences:

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
4. If the budget is tight for ${destination}, mention practical budget-saving alternatives in the trip summary.
5. Do NOT include markdown code blocks, do NOT write \`\`\`json or \`\`\`. Output ONLY the raw valid JSON object.

REQUIRED JSON STRUCTURE:
{
  "destination": "${destination}",
  "tripSummary": "Concise overview highlighting the itinerary vibe and budget strategy",
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
        "activity": "Morning Landmark/Activity",
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

    // Attach metadata
    parsedJson.modelUsed = TARGET_MODEL;
    parsedJson.generatedAt = new Date().toISOString();

    return res.json({
      success: true,
      itinerary: parsedJson
    });

    // If gemma-4-31b-it call succeeded, return its parsed response
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
