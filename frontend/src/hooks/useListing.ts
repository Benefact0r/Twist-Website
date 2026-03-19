import { useState, useEffect } from 'react';
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
  favorite_count?: number | null;
  created_at: string;
  updated_at: string;
}

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

// Transform Supabase item to Listing type
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

export function useListing(id: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        setListing(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // First, check mock data (for demo/development)
      const mockListings = getAllListings();
      const mockListing = mockListings.find((l) => l.id === id);
      
      if (mockListing) {
        setListing(mockListing);
        setLoading(false);
        return;
      }

      // If not in mock data, try API
      try {
        const response = await request<{ listing: SupabaseItem }>(`/listings/${id}`, { auth: false });
        if (response?.listing) {
          setListing(transformItemToListing(response.listing));
        } else {
          setError('Listing not found');
          setListing(null);
        }
      } catch (err) {
        console.error('Error in useListing:', err);
        setError('Failed to fetch listing');
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return { listing, loading, error };
}
