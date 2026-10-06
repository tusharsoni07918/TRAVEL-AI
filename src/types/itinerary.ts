import type { TripFormData } from './travel';

export interface Activity {
  activity: string;
  description: string;
  estimatedCost: number;
  duration: string;
}

export interface DayPlan {
  day: number;
  title: string;
  morning?: Activity;
  afternoon?: Activity;
  evening?: Activity;
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

export interface Itinerary {
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
