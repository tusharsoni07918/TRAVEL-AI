// Intelligent activity-specific image resolver for TripGenie AI

interface ImageQueryMatch {
  keywords: string[];
  url: string;
}

// Curated high-res travel photography database by landmark/activity theme
const CURATED_ACTIVITY_IMAGES: ImageQueryMatch[] = [
  // Beaches & Water activities
  {
    keywords: ['palolem', 'butterfly beach', 'kayak', 'dolphin', 'boat'],
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['baga', 'calangute', 'water sports', 'parasailing', 'jet ski', 'banana ride'],
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['anjuna', 'curlies', 'vagator', 'cliff', 'sunset beach', 'shack'],
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['dudhsagar', 'waterfall', 'falls', 'cascade', 'jeep safari'],
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['cabo de rama', 'fort', 'ruins', 'cliff view', 'aguada', 'chapora'],
    url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['old goa', 'basilica', 'bom jesus', 'church', 'cathedral', 'heritage'],
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['spice plantation', 'farm', 'tropical', 'botanical', 'plantation'],
    url: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['cruise', 'mandovi', 'casino', 'yacht', 'sundown cruise', 'river'],
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['market', 'flea market', 'bazaar', 'shopping', 'night market', 'street'],
    url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['scuba', 'diving', 'snorkeling', 'underwater', 'coral', 'marine'],
    url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&auto=format&fit=crop&q=80'
  },
  // Mountains, Snow, Trekking (e.g. Manali, Himalayas)
  {
    keywords: ['solang', 'rohtang', 'snow', 'glacier', 'paragliding', 'valley'],
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['hadimba', 'temple', 'monastery', 'pagoda', 'shrine'],
    url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['trek', 'hiking', 'mountain pass', 'trail', 'jogini falls'],
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80'
  },
  // Dining & Cafes
  {
    keywords: ['dinner', 'seafood', 'cafe', 'candlelight', 'dining', 'breakfast', 'lunch', 'cocktail', 'tasting'],
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80'
  },
  // Sunset & Panoramic views
  {
    keywords: ['sunset', 'golden hour', 'twilight', 'viewpoint', 'panorama'],
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop&q=80'
  },
  // City, Culture & General Travel
  {
    keywords: ['museum', 'art gallery', 'exhibition', 'monument', 'palace'],
    url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&auto=format&fit=crop&q=80'
  },
  {
    keywords: ['resort', 'hotel check-in', 'spa', 'massage', 'relax', 'pool', 'wellness'],
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80'
  }
];

// Fallback thematic pools by time of day
const TIME_OF_DAY_FALLBACKS: Record<string, string[]> = {
  morning: [
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
  ],
  afternoon: [
    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&auto=format&fit=crop&q=80'
  ],
  evening: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=80'
  ]
};

// Simple in-memory cache to guarantee consistent fast lookups
const imageCache = new Map<string, string>();

/**
 * Returns a high-quality location image matching the activity, destination, and time of day
 */
export function getActivityLocationImage(
  activityTitle: string,
  destination: string,
  timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning',
  customImageUrl?: string
): string {
  if (customImageUrl && customImageUrl.startsWith('http')) {
    return customImageUrl;
  }

  const cacheKey = `${destination.toLowerCase()}_${activityTitle.toLowerCase()}_${timeOfDay}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  const searchSubject = `${activityTitle} ${destination}`.toLowerCase();

  // 1. Search curated activity database for keyword matches
  for (const item of CURATED_ACTIVITY_IMAGES) {
    const match = item.keywords.some(kw => searchSubject.includes(kw));
    if (match) {
      imageCache.set(cacheKey, item.url);
      return item.url;
    }
  }

  // 2. Deterministic selection from time of day pool
  const pool = TIME_OF_DAY_FALLBACKS[timeOfDay] || TIME_OF_FALLBACK_DEFAULT;
  let hash = 0;
  for (let i = 0; i < searchSubject.length; i++) {
    hash = (hash << 5) - hash + searchSubject.charCodeAt(i);
    hash |= 0;
  }
  const selected = pool[Math.abs(hash) % pool.length];
  imageCache.set(cacheKey, selected);
  return selected;
}

const TIME_OF_FALLBACK_DEFAULT = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80'
];
