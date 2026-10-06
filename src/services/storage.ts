import { SavedTrip } from '../types/travel';

const STORAGE_KEY = 'tripgenie_saved_trips_v1';

export function getSavedTrips(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read saved trips from localStorage:', err);
    return [];
  }
}

export function saveTripToStorage(trip: SavedTrip): { success: boolean; isDuplicate: boolean } {
  try {
    const trips = getSavedTrips();
    // Check if duplicate already exists with same destination & same day/cost
    const isDuplicate = trips.some(
      t => t.id === trip.id || (
        t.destination.toLowerCase() === trip.destination.toLowerCase() &&
        t.durationDays === trip.durationDays &&
        t.totalEstimatedCost === trip.totalEstimatedCost &&
        t.createdAt === trip.createdAt
      )
    );

    if (isDuplicate) {
      return { success: true, isDuplicate: true };
    }

    const updated = [trip, ...trips];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true, isDuplicate: false };
  } catch (err) {
    console.error('Failed to save trip to localStorage:', err);
    return { success: false, isDuplicate: false };
  }
}

export function deleteTripFromStorage(id: string): SavedTrip[] {
  try {
    const trips = getSavedTrips();
    const updated = trips.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete trip from localStorage:', err);
    return [];
  }
}

export function getSavedTripById(id: string): SavedTrip | null {
  const trips = getSavedTrips();
  return trips.find(t => t.id === id) || null;
}
