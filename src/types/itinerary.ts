import type { TripFormData } from './travel';

export interface Activity {
  activity: string;
  description: string;
  estimatedCost: number;
  duration: string;
}

export interface TransitHop {
  from: string;
  to: string;
  mode: string;
  duration: string;
  costEstimate: string;
  distanceKm?: number;
}

export interface DayPlan {
  day: number;
  title: string;
  morning?: Activity;
  afternoon?: Activity;
  evening?: Activity;
  transitMorningAfternoon?: TransitHop;
  transitAfternoonEvening?: TransitHop;
  foodRecommendation?: string;
  dailyEstimatedCost: number;
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  miscellaneous: number;
}

export interface AccommodationSuggestionItem {
  name: string;
  description?: string;
  category?: string;
  estimatedPrice?: string | number;
}

export interface LocalPhrase {
  phrase: string;
  meaning: string;
  phonetic: string;
  usageContext: string;
}

export interface PhotoSpot {
  spot: string;
  bestTime: string;
  tip: string;
  vibe: string;
}

export interface Itinerary {
  startingPoint?: string;
  destination: string;
  tripSummary: string;
  totalEstimatedCost: number;
  currency: string;
  budgetBreakdown?: BudgetBreakdown;
  days: DayPlan[];
  accommodationSuggestions?: (string | AccommodationSuggestionItem)[];
  transportationTips?: string[];
  travelTips?: string[];
  safetyTips?: string[];
  packingTips?: string[];
  // Unique Traveler Toolkit Fields
  localPhrases?: LocalPhrase[];
  culturalEtiquette?: string[];
  fairPricingTips?: string[];
  photoSpots?: PhotoSpot[];
  contingencyPlans?: {
    rainOption: string;
    delayOption: string;
  };
  // Metadata
  modelUsed?: string;
  generatedAt?: string;
}

export type ErrorType = 
  | 'VALIDATION_ERROR'
  | 'MISSING_API_KEY'
  | 'MODEL_UNAVAILABLE'
  | 'UNAUTHORIZED'
  | 'RATE_LIMIT'
  | 'TIMEOUT'
  | 'MALFORMED_RESPONSE'
  | 'INVALID_JSON'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface GenerationError {
  type: ErrorType;
  message: string;
  diagnosticDetails?: string;
  modelTargeted: string;
}

export interface GenerateItineraryResponse {
  success: boolean;
  itinerary?: Itinerary;
  error?: GenerationError;
}

export interface ActivityAlternativesResponse {
  success: boolean;
  alternatives?: Activity[];
  error?: GenerationError;
}

export interface CustomizeItineraryResponse {
  success: boolean;
  itinerary?: Itinerary;
  customizationSummary?: string;
  error?: GenerationError;
}
