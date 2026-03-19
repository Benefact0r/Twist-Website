import { useState, useEffect } from 'react';
import { request } from '@/lib/apiClient';
import { Listing, ListingCondition, ListingImage } from '@/types';
import { getAllListings } from '@/data/mockData';

interface ApiListingItem {
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

// Transform API listing payload to app Listing type
const transformItemToListing = (item: ApiListingItem): Listing => {
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
    viewCount: Math.floor(Math.random() * 100),
    favoriteCount: Math.floor(Math.random() * 30),
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  };
};

export function useHomeListings() {
  const [newArrivals, setNewArrivals] = useState<Listing[]>([]);
  const [popularListings, setPopularListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);

      try {
        const homeData = await request<{ newArrivals: ApiListingItem[]; popularListings: ApiListingItem[] }>('/listings/home', {
          auth: false,
        });

        // Transform API data
        const apiNewArrivals = (homeData.newArrivals || []).map((item) => 
          transformItemToListing(item as ApiListingItem)
        );

        const apiPopular = (homeData.popularListings || [])
          .map((item) => transformItemToListing(item as ApiListingItem))
          .sort((a, b) => b.favoriteCount - a.favoriteCount)
          .slice(0, 10);

        // Get mock data as fallback
        const mockListings = getAllListings();

        // Combine: prioritize API data, fill with mock if needed
        if (apiNewArrivals.length >= 5) {
          setNewArrivals(apiNewArrivals.slice(0, 5));
        } else {
          const combined = [...apiNewArrivals, ...mockListings.slice(0, 5 - apiNewArrivals.length)];
          setNewArrivals(combined.slice(0, 5));
        }

        if (apiPopular.length >= 5) {
          setPopularListings(apiPopular.slice(0, 5));
        } else {
          const mockPopular = [...mockListings].sort((a, b) => b.favoriteCount - a.favoriteCount);
          const combined = [...apiPopular, ...mockPopular.slice(0, 5 - apiPopular.length)];
          setPopularListings(combined.slice(0, 5));
        }
      } catch (error) {
        console.error('Error in useHomeListings:', error);
        // Fallback to mock data
        const mockListings = getAllListings();
        setNewArrivals(mockListings.slice(0, 5));
        setPopularListings([...mockListings].sort((a, b) => b.favoriteCount - a.favoriteCount).slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return { newArrivals, popularListings, loading };
}
