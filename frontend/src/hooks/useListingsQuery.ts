import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/apiClient';
import { Listing, ListingCondition, ListingImage } from '@/types';
import { getDescendantIds } from '@/data/categories';

// Responsive page sizes
export const PAGE_SIZE_MOBILE = 6;
export const PAGE_SIZE_DESKTOP = 12;

export interface UseListingsQueryOptions {
  categoryId?: string;
  searchQuery?: string;
  conditions?: ListingCondition[];
  priceRange?: [number | null, number | null];
  sortBy?: string;
  sellerId?: string;
  page?: number;
  pageSize?: number;
}

// Map frontend condition to database format
const mapConditionToDb = (condition: ListingCondition): string => {
  const conditionMap: Record<ListingCondition, string> = {
    'new': 'new',
    'like-new': 'like_new',
    'good': 'good',
    'fair': 'fair',
  };
  return conditionMap[condition] || 'good';
};

// Map database condition to frontend type
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

interface HybridSearchRow {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  images: string[] | null;
  favorite_count?: number;
  created_at: string;
  relevance_score?: number;
  total_count?: number;
  seller_id?: string;
  description?: string | null;
  status?: string;
  updated_at?: string;
}

const transformRow = (row: HybridSearchRow): Listing => {
  const firstImage = row.images?.[0];
  const images: ListingImage[] = firstImage
    ? [{ id: `img-${row.id}-0`, url: firstImage, thumbnailUrl: firstImage, order: 0 }]
    : [{ id: `img-${row.id}-placeholder`, url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop', order: 0 }];

  return {
    id: row.id,
    sellerId: row.seller_id || '',
    title: row.title,
    description: row.description || '',
    price: row.price,
    currency: 'GEL',
    categoryId: row.category,
    condition: mapCondition(row.condition),
    tags: [],
    images,
    status: row.status === 'sold' ? 'sold' : row.status === 'archived' ? 'archived' : 'active',
    viewCount: 0,
    favoriteCount: row.favorite_count ?? 0,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at || row.created_at),
  };
};

async function fetchListings(options: UseListingsQueryOptions) {
  const pageSize = options.pageSize || PAGE_SIZE_DESKTOP;
  const page = options.page || 0;
  if (options.sellerId) {
    const sellerData = await request<{ items: HybridSearchRow[] }>(`/sellers/${options.sellerId}/listings`, { auth: false });
    const rows = sellerData.items || [];
    const totalCount = rows.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const paged = rows.slice(page * pageSize, page * pageSize + pageSize);
    return {
      listings: paged.map((item) => transformRow({ ...item, total_count: totalCount })),
      totalCount,
      totalPages,
      currentPage: page,
      pageSize,
      hasNextPage: page < totalPages - 1,
      hasPrevPage: page > 0,
    };
  }
  const descendantIds = options.categoryId ? getDescendantIds(options.categoryId) : [];
  const allCategories = options.categoryId ? [options.categoryId, ...descendantIds] : [];
  const data = await request<{
    items: HybridSearchRow[];
    totalCount: number;
    totalPages: number;
    page: number;
    pageSize: number;
  }>(
    `/listings/search?q=${encodeURIComponent(options.searchQuery || '')}` +
      `&category=${encodeURIComponent(allCategories[0] || '')}` +
      `&conditions=${encodeURIComponent((options.conditions || []).map(mapConditionToDb).join(','))}` +
      `&minPrice=${options.priceRange?.[0] ?? ''}` +
      `&maxPrice=${options.priceRange?.[1] ?? ''}` +
      `&sort=${encodeURIComponent(options.sortBy || 'relevance')}` +
      `&page=${page}` +
      `&pageSize=${pageSize}`,
    { auth: false },
  );

  const listings = (data.items || []).map((item) => transformRow({ ...item, total_count: data.totalCount }));
  const totalCount = data.totalCount || 0;
  const totalPages = data.totalPages || 0;

  return {
    listings,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize,
    hasNextPage: page < totalPages - 1,
    hasPrevPage: page > 0,
  };
}

export function useListingsQuery(options: UseListingsQueryOptions = {}) {
  const queryKey = [
    'listings',
    options.categoryId,
    options.searchQuery,
    options.sortBy,
    options.sellerId,
    options.conditions,
    options.priceRange,
    options.page,
    options.pageSize,
  ];

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchListings(options),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
    retry: false,
  });

  return {
    listings: data?.listings || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 0,
    pageSize: data?.pageSize || PAGE_SIZE_DESKTOP,
    hasNextPage: data?.hasNextPage || false,
    hasPrevPage: data?.hasPrevPage || false,
    loading: isLoading && !data,
    isFetching,
    error: error?.message || null,
    refetch,
  };
}
