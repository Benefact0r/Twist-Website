import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/apiClient';
import { Listing, ListingCondition, ListingImage } from '@/types';
import { getAllListings } from '@/data/mockData';

interface SupabaseItem {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  condition: string;
  images: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  favorite_count: number;
}

const mapCondition = (dbCondition: string): ListingCondition => {
  const conditionMap: Record<string, ListingCondition> = {
    'new': 'new',
    'like_new': 'like-new',
    'good': 'good',
    'fair': 'fair',
    'poor': 'fair',
  };
  return conditionMap[dbCondition] || 'good';
};

const transformItemToListing = (item: SupabaseItem): Listing => {
  const images: ListingImage[] = (item.images || []).map((url, index) => ({
    id: `img-${item.id}-${index}`,
    url,
    thumbnailUrl: url,
    order: index,
  }));

  if (images.length === 0) {
    images.push({
      id: `img-${item.id}-placeholder`,
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
      order: 0,
    });
  }

  return {
    id: item.id,
    sellerId: item.seller_id,
    title: item.title,
    description: item.description || '',
    price: item.price,
    currency: 'GEL',
    categoryId: item.category,
    condition: mapCondition(item.condition),
    tags: [],
    images,
    status: item.status === 'active' ? 'active' : item.status === 'sold' ? 'sold' : 'archived',
    viewCount: 0,
    favoriteCount: item.favorite_count ?? 0,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  };
};

/**
 * Shuffle array in-place (Fisher-Yates) and return it.
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick diverse items: try to pick at most one per category, then fill remaining.
 */
function pickDiverse(items: Listing[], count: number): Listing[] {
  const byCategory = new Map<string, Listing[]>();
  for (const item of items) {
    const cat = item.categoryId.split('-')[0]; // root category
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(item);
  }

  // Shuffle within each category
  for (const [key, val] of byCategory) {
    byCategory.set(key, shuffle(val));
  }

  const result: Listing[] = [];
  const usedIds = new Set<string>();

  // Round-robin pick from each category
  const categories = shuffle([...byCategory.keys()]);
  let round = 0;
  while (result.length < count) {
    let picked = false;
    for (const cat of categories) {
      if (result.length >= count) break;
      const catItems = byCategory.get(cat)!;
      if (round < catItems.length) {
        const item = catItems[round];
        if (!usedIds.has(item.id)) {
          result.push(item);
          usedIds.add(item.id);
          picked = true;
        }
      }
    }
    if (!picked) break;
    round++;
  }

  return result;
}

async function fetchHomeListings() {
  const FEATURED_COUNT = 8;
  const NEW_ARRIVALS_COUNT = 10;

  // Fetch from API
  const home = await request<{ newArrivals: SupabaseItem[]; popularListings: SupabaseItem[] }>('/listings/home', { auth: false });
  const pool = ([...(home.newArrivals || []), ...(home.popularListings || [])] || []).map((item) =>
    transformItemToListing(item as unknown as SupabaseItem)
  );

  // Get mock data as fallback
  const mockListings = getAllListings();

  // Build featured: diverse category selection from pool
  let featured: Listing[];
  if (pool.length >= FEATURED_COUNT) {
    featured = pickDiverse(pool, FEATURED_COUNT);
  } else {
    // Fill with mock data for diversity
    const combined = [...pool, ...shuffle(mockListings)];
    featured = pickDiverse(combined, FEATURED_COUNT);
  }

  const featuredIds = new Set(featured.map((l) => l.id));

  const newestAll = (home.newArrivals || []).map((item) =>
    transformItemToListing(item as unknown as SupabaseItem)
  );

  // Exclude featured items
  let newArrivals = newestAll.filter((l) => !featuredIds.has(l.id)).slice(0, NEW_ARRIVALS_COUNT);

  // Fill with mock if needed
  if (newArrivals.length < 5) {
    const mockNewest = mockListings
      .filter((l) => !featuredIds.has(l.id))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, NEW_ARRIVALS_COUNT - newArrivals.length);
    newArrivals = [...newArrivals, ...mockNewest].slice(0, NEW_ARRIVALS_COUNT);
  }

  return { featured, newArrivals };
}

export function useHomeListingsQuery() {
  const { data, isLoading } = useQuery({
    queryKey: ['homeListings'],
    queryFn: fetchHomeListings,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    featured: data?.featured || [],
    newArrivals: data?.newArrivals || [],
    loading: isLoading,
  };
}
