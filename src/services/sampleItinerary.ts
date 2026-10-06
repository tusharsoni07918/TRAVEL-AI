import { TripFormData } from '../types/travel';
import { Itinerary } from '../types/itinerary';

export function createSampleItinerary(formData: TripFormData): Itinerary {
  const daysCount = Math.max(1, Number(formData.numberOfDays) || 3);
  const budget = Number(formData.budget) || 15000;
  const currency = formData.currency || 'INR';

  const days = Array.from({ length: daysCount }, (_, i) => {
    const dayNum = i + 1;
    return {
      day: dayNum,
      title: dayNum === 1 
        ? 'Arrival, Coastal Check-in & Sunset Welcome' 
        : dayNum === 2 
          ? 'Heritage Trails, Cultural Exploration & Local Markets' 
          : dayNum === 3 
            ? 'Adventure Sights & Scenic Excursions' 
            : `Day ${dayNum}: Immersive Discovery & Local Delights`,
      morning: {
        activity: dayNum === 1 ? 'Hotel Check-in & Orientation' : `${formData.destination} Landmark Tour`,
        description: `Explore the vibrant morning atmosphere of ${formData.destination} with leisurely strolls and photography.`,
        estimatedCost: Math.round(budget * 0.05),
        duration: '2-3 hours'
      },
      afternoon: {
        activity: `${formData.interests[0] || 'Local Sightseeing'} & Artisan Quarter`,
        description: `Experience authentic local culture, handicraft shops, and scenic vantage points in ${formData.destination}.`,
        estimatedCost: Math.round(budget * 0.06),
        duration: '3 hours'
      },
      evening: {
        activity: 'Sunset Gathering & Leisure Stroll',
        description: 'Unwind as the golden hour settles over the district with scenic views and relaxing ambience.',
        estimatedCost: Math.round(budget * 0.04),
        duration: '2 hours'
      },
      foodRecommendation: `Local specialty bistro featuring ${formData.foodPreference} delicacies paired with fresh regional ingredients.`,
      dailyEstimatedCost: Math.round(budget / daysCount)
    };
  });

  return {
    destination: formData.destination || 'Goa',
    tripSummary: `A meticulously balanced ${daysCount}-day ${formData.travelType.toLowerCase()} journey through ${formData.destination || 'Goa'}, harmonizing ${formData.interests.join(' and ')} within your budget of ${currency} ${budget.toLocaleString()}.`,
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
      `Centrally located ${formData.accommodation} hotel near public transit hubs`,
      `Charming boutique guesthouse with breakfast included`,
      `Scenic eco-stay offering easy access to nature and beach spots`
    ],
    transportationTips: [
      `Utilize ${formData.transportPreference} for the most budget-conscious local connectivity`,
      'Pre-book point-to-point transit during peak evening hours',
      'Download offline transit maps before departure'
    ],
    travelTips: [
      'Carry cash for small street vendors and artisan stalls',
      'Start morning activities before 10 AM to bypass peak tour crowds',
      'Stay hydrated and keep digital copies of booking vouchers'
    ],
    safetyTips: [
      'Store passport and primary cards in your room safe or secure pouch',
      'Keep local emergency and tourist police contacts saved on your phone',
      'Confirm taxi fares before commencing long trips'
    ],
    packingTips: [
      'Breathable cotton apparel and comfortable walking shoes',
      'Universal power adapter, power bank, and compact rain cover',
      'Sun protection, sunglasses, and personal reusable water bottle'
    ],
    modelUsed: 'gemma-4-31b-it',
    generatedAt: new Date().toISOString()
  };
}
