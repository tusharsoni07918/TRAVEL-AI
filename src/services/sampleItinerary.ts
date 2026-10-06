import { TripFormData } from '../types/travel';
import { Itinerary } from '../types/itinerary';

export function createSampleItinerary(formData: TripFormData): Itinerary {
  const daysCount = Math.max(1, Number(formData.numberOfDays) || 3);
  const budget = Number(formData.budget) || 15000;
  const currency = formData.currency || 'INR';
  const dest = formData.destination || 'Goa';

  const days = [
    {
      day: 1,
      title: 'North Goa Coastal Welcome & Sunset at Curlies',
      morning: {
        activity: 'Arrival, Hotel Check-in & Vagator Cliff Walk',
        description: 'Settle into your accommodation, unpack, and take an unhurried morning stroll along the Chapora red laterite cliffs.',
        estimatedCost: 300,
        duration: '2.5 hours'
      },
      transitMorningAfternoon: {
        from: 'Vagator Cliff Walk',
        to: 'Anjuna Flea Market',
        mode: 'Rental Scooter',
        duration: '12 mins',
        costEstimate: `${currency} 50`
      },
      afternoon: {
        activity: 'Anjuna Flea Market & Beachside Relaxation',
        description: 'Browse bohemian handicrafts, beach apparel, artisan jewelry, and enjoy refreshing tender coconut water by the shore.',
        estimatedCost: 600,
        duration: '3 hours'
      },
      transitAfternoonEvening: {
        from: 'Anjuna Flea Market',
        to: 'Curlies Beach Shack',
        mode: 'Beach Walk / Scooter',
        duration: '10 mins',
        costEstimate: `${currency} 30`
      },
      evening: {
        activity: 'Sunset Views at Anjuna & Evening Seafood Feast',
        description: 'Relax to ambient acoustic beach shacks as the sun sets over the Arabian Sea with chilled beverages.',
        estimatedCost: 800,
        duration: '2 hours'
      },
      foodRecommendation: 'Curlies Beach Shack (Fresh coastal fish curry thali with vegetarian paneer options)',
      dailyEstimatedCost: Math.round(budget / daysCount)
    },
    {
      day: 2,
      title: 'Old Goa Heritage Trails & Mandovi River Cruise',
      morning: {
        activity: 'Basilica of Bom Jesus & Fontainhas Latin Quarter',
        description: 'Explore UNESCO-listed Portuguese baroque cathedrals and colorful historic pastel streets in Panaji.',
        estimatedCost: 400,
        duration: '3 hours'
      },
      transitMorningAfternoon: {
        from: 'Fontainhas Latin Quarter',
        to: 'Spice Plantation Ponda',
        mode: 'Local Cab / Auto',
        duration: '25 mins',
        costEstimate: `${currency} 350`
      },
      afternoon: {
        activity: 'Spice Plantation Tour & Traditional Buffet',
        description: 'Guided tour of cardamoms, vanilla vines, and betel nut groves with traditional Goan lunch served on banana leaves.',
        estimatedCost: 900,
        duration: '3 hours'
      },
      transitAfternoonEvening: {
        from: 'Spice Plantation',
        to: 'Mandovi Jetty',
        mode: 'Local Cab',
        duration: '30 mins',
        costEstimate: `${currency} 400`
      },
      evening: {
        activity: 'Mandovi Sunset River Cruise & Live Folk Dance',
        description: 'Enjoy scenic backwater breeze with traditional Goan folk music, Dekhni performances, and night vistas of Panaji.',
        estimatedCost: 700,
        duration: '2 hours'
      },
      foodRecommendation: 'Viva Panjim in Fontainhas (Authentic Goan curry and regional vegetable stew)',
      dailyEstimatedCost: Math.round(budget / daysCount)
    },
    {
      day: 3,
      title: 'South Goa Serenity & Water Sports Excursion',
      morning: {
        activity: 'Palolem Beach Kayaking & Butterfly Beach Boat Trip',
        description: 'Glide along calm turquoise waters and spot local dolphins off the Palolem crescent bay.',
        estimatedCost: 1000,
        duration: '3 hours'
      },
      transitMorningAfternoon: {
        from: 'Palolem Beach',
        to: 'Cabo de Rama Fort',
        mode: 'Scenic Coastal Scooter',
        duration: '22 mins',
        costEstimate: `${currency} 80`
      },
      afternoon: {
        activity: 'Cabo de Rama Fort Ruins & Sea Panorama',
        description: 'Photograph panoramic coastal cliffs from the historic Portuguese fortress ramparts.',
        estimatedCost: 200,
        duration: '2.5 hours'
      },
      transitAfternoonEvening: {
        from: 'Cabo de Rama Fort',
        to: 'Colva Shoreline',
        mode: 'Scooter / Cab',
        duration: '20 mins',
        costEstimate: `${currency} 100`
      },
      evening: {
        activity: 'Candlelight Dinner by Colva Beach Shoreline',
        description: 'Unwind on the soft white sands of South Goa with chilled regional beverages, live jazz, and Goan dessert.',
        estimatedCost: 950,
        duration: '2 hours'
      },
      foodRecommendation: 'Martin\'s Corner (Celebrated Goan hospitality with extensive seafood & vegetarian menu)',
      dailyEstimatedCost: Math.round(budget / daysCount)
    }
  ];

  return {
    destination: dest,
    tripSummary: `A comprehensive ${daysCount}-day ${formData.travelType.toLowerCase()} journey through ${dest}, curated for a ${formData.travelPace.toLowerCase()} pace and focusing on ${formData.interests.join(', ')}. Planned within your target budget of ${currency} ${budget.toLocaleString()} (${formData.accommodation} accommodations, ${formData.transportPreference} transit). Powered by Gemma 4 31B IT.`,
    totalEstimatedCost: budget,
    currency,
    budgetBreakdown: {
      accommodation: Math.round(budget * 0.38),
      food: Math.round(budget * 0.28),
      transportation: Math.round(budget * 0.16),
      activities: Math.round(budget * 0.12),
      miscellaneous: Math.round(budget * 0.06)
    },
    days,
    accommodationSuggestions: [
      `Vagator Hillside Boutique Resort (Pool & ocean view)`,
      `Fontainhas Heritage Portuguese Inn (Historic Panaji)`,
      `Palolem Eco Beach Cabanas (Direct shoreline access)`
    ],
    transportationTips: [
      `Rent an Activa scooter (₹350–₹450/day) for optimal coastal flexibility`,
      'Pre-install GoaMiles app for government-regulated taxi pricing',
      'Download offline Google Maps for South Goa forest patches'
    ],
    travelTips: [
      'Carry cash for small beach shacks and flea market bargaining',
      'Start morning church visits early before afternoon heat sets in',
      'Always confirm scooter helmet availability before signing rental agreements'
    ],
    safetyTips: [
      'Swim only within designated lifeguard-patrolled red and yellow flag zones',
      'Save local police emergency line (112) and tourist assistance (1363)',
      'Keep your scooter rental receipt and driver license accessible'
    ],
    packingTips: [
      'Quick-dry beachwear, cotton t-shirts, and linen shorts',
      'Waterproof dry-bag (10L) for boat rides and kayaking',
      'Reef-safe sunscreen, polarized sunglasses, and comfortable sandals'
    ],
    localPhrases: [
      { phrase: 'Kitem cholla?', phonetic: 'kee-tem chol-lah', meaning: 'How are things going? / What is up?', usageContext: 'Casual greeting with friendly locals & shack owners' },
      { phrase: 'Dev borem korum', phonetic: 'dev boh-rem koh-rum', meaning: 'Thank you / God bless you', usageContext: 'Heartfelt thank you after meals or hospitality' },
      { phrase: 'Hacho dor kitlem?', phonetic: 'hah-cho dor kit-lem', meaning: 'How much does this cost?', usageContext: 'Bargaining at Mapusa or Anjuna markets' },
      { phrase: 'Maka he zai', phonetic: 'mah-kah hay zye', meaning: 'I would like this', usageContext: 'Ordering delicious fish thali or drinks' },
      { phrase: 'Borem asa', phonetic: 'boh-rem ah-sah', meaning: 'It is very good / Delicious', usageContext: 'Complimenting fresh local culinary cooking' },
    ],
    culturalEtiquette: [
      'Dress respectfully when visiting ancient churches in Old Goa (cover shoulders & knees).',
      'Negotiate taxi and auto-rickshaw fares politely BEFORE starting your ride, or use GoaMiles app.',
      'Always ask permission before taking close-up portraits of traditional coastal fishermen.',
      'Support local shack owners with modest tips (5–10% is deeply appreciated).'
    ],
    fairPricingTips: [
      'Scooter Rentals: Typical rate is ₹350–₹500/day for Activa. Peak holiday seasons may reach ₹700.',
      'Beach Beds: Free with food/drink purchase at beach shacks; avoid paying separate flat fees.',
      'Water Sports: Bargain combo packages (parasailing + jet ski + banana ride) for ₹1,200–₹1,800/person.'
    ],
    photoSpots: [
      { spot: 'Chapora Fort Ramparts', bestTime: '5:30 PM (Golden Sunset)', tip: 'Perch on the red laterite stone cliffs overlooking Vagator bay for dramatic silhouettes.', vibe: 'Cinematic Sunset' },
      { spot: 'Fontainhas Latin Quarter', bestTime: '8:30 AM (Soft Morning Light)', tip: 'Capture pastel yellow, indigo, and terracotta Portuguese balconies before cars park.', vibe: 'Architectural Colors' },
      { spot: 'Cabo de Rama Cliff Edge', bestTime: '4:00 PM (Late Afternoon)', tip: 'Wide angle showing the sheer cliff drop into turquoise Arabian waves.', vibe: 'Dramatic Coastline' },
      { spot: 'Palolem Beach Crescent', bestTime: '6:30 PM (Blue Hour)', tip: 'Fairy lights illuminating beach shacks with reflections on low-tide wet sand.', vibe: 'Ambient Twilight' },
    ],
    modelUsed: 'gemma-4-31b-it',
    generatedAt: new Date().toISOString()
  };
}
