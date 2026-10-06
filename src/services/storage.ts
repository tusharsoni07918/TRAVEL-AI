import { SavedTrip } from '../types/travel';

const BASE_STORAGE_KEY = 'tripgenie_saved_trips_v1';

function getKey(userUid?: string | null): string {
  return userUid ? `${BASE_STORAGE_KEY}_usr_${userUid}` : BASE_STORAGE_KEY;
}

export function getSavedTrips(userUid?: string | null): SavedTrip[] {
  try {
    const key = getKey(userUid);
    const raw = localStorage.getItem(key);
    if (!raw) {
      // If user is logged in but hasn't saved user-specific trips yet, check if there are guest trips to view
      if (userUid) {
        const guestRaw = localStorage.getItem(BASE_STORAGE_KEY);
        if (guestRaw) {
          const parsedGuest = JSON.parse(guestRaw);
          if (Array.isArray(parsedGuest) && parsedGuest.length > 0) {
            return parsedGuest;
          }
        }
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read saved trips from localStorage:', err);
    return [];
  }
}

export function saveTripToStorage(trip: SavedTrip, userUid?: string | null): { success: boolean; isDuplicate: boolean } {
  try {
    const key = getKey(userUid);
    const trips = getSavedTrips(userUid);
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
    localStorage.setItem(key, JSON.stringify(updated));
    return { success: true, isDuplicate: false };
  } catch (err) {
    console.error('Failed to save trip to localStorage:', err);
    return { success: false, isDuplicate: false };
  }
}

export function deleteTripFromStorage(id: string, userUid?: string | null): SavedTrip[] {
  try {
    const key = getKey(userUid);
    const trips = getSavedTrips(userUid);
    const updated = trips.filter(t => t.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete trip from localStorage:', err);
    return [];
  }
}

export function getSavedTripById(id: string, userUid?: string | null): SavedTrip | null {
  const trips = getSavedTrips(userUid);
  return trips.find(t => t.id === id) || null;
}

