export type TravelType = 'Solo' | 'Couple' | 'Family' | 'Friends';
export type TravelPace = 'Relaxed' | 'Balanced' | 'Fast-paced';
export type FoodPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'No Preference';
export type TransportPreference = 'Public Transport' | 'Taxi/Cab' | 'Rental Car' | 'Walking' | 'Mixed';
export type AccommodationType = 'Budget' | 'Mid-range' | 'Luxury';
export type Interest = 
  | 'Beaches'
  | 'Adventure'
  | 'Food'
  | 'Culture'
  | 'History'
  | 'Nature'
  | 'Shopping'
  | 'Photography';

export interface TripFormData {
  destination: string;
  startDate: string;
  numberOfDays: number;
  numberOfTravelers: number;
  budget: number | string;
  currency: string;
  travelType: TravelType;
  travelPace: TravelPace;
  interests: Interest[];
  foodPreference: FoodPreference;
  transportPreference: TransportPreference;
  accommodation: AccommodationType;
  additionalRequirements: string;
}

export interface SavedTrip {
  id: string;
  destination: string;
  durationDays: number;
  travelers: number;
  travelType: TravelType;
  budgetFormatted: string;
  createdDate: string;
  status: 'Ready' | 'Draft';
  imageUrl: string;
}
