import { useCallback } from 'react';
import { request } from '@/lib/apiClient';
import { mockSellers, getAllListings } from '@/data/mockData';
import { mockReviews } from '@/data/mockReviews';
import type { Listing, ListingCondition, ListingImage } from '@/types';

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const mapCondition = (dbCondition: string): ListingCondition => {
  const conditionMap: Record<string, ListingCondition> = {
    new: 'new',
    like_new: 'like-new',
    good: 'good',
    fair: 'fair',
    poor: 'fair',
  };
  return conditionMap[dbCondition] || 'good';
};

type SupabaseItemRow = {
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
};

const transformItemToListing = (item: SupabaseItemRow): Listing => {
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
    price: Number(item.price),
    currency: 'GEL',
    categoryId: item.category,
    condition: mapCondition(item.condition),
    tags: [],
    images,
    status:
      item.status === 'active'
        ? 'active'
        : item.status === 'sold'
          ? 'sold'
          : 'archived',
    viewCount: 0,
    favoriteCount: item.favorite_count ?? 0,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  };
};

export interface SellerData {
  id: string;
  username: string | null;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  isVerified: boolean;
  isSeller: boolean;
  createdAt: Date;
  rating: number;
  reviewCount: number;
  numSales: number;
  location: string | null;
  lastOnline: Date | null;
  followers: number;
  following: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface SellerReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  sellerId: string;
  rating: number;
  text: string | null;
  createdAt: Date;
}

export function useSellerProfile() {
  // Fetch seller by ID (supports both real users and mock sellers)
  const getSellerById = useCallback(async (sellerId: string): Promise<SellerData | null> => {
    // First try to find in mock sellers
    const mockSeller = mockSellers.find(s => s.id === sellerId);
    if (mockSeller) {
      return {
        id: mockSeller.id,
        username: mockSeller.displayName,
        displayName: mockSeller.displayName,
        avatar: mockSeller.avatar,
        bio: mockSeller.bio || null,
        isVerified: mockSeller.isVerified,
        isSeller: true,
        createdAt: mockSeller.createdAt,
        rating: mockSeller.rating,
        reviewCount: mockSeller.numReviews,
        numSales: mockSeller.numSales,
        location: mockSeller.location || null,
        lastOnline: mockSeller.lastOnline || null,
        followers: mockSeller.followers || 0,
        following: mockSeller.following || 0,
        isEmailVerified: true,
        isPhoneVerified: mockSeller.isPhoneVerified,
      };
    }

    // Try real API seller
    try {
      const { seller } = await request<{ seller: any }>(`/sellers/${sellerId}`, { auth: false });
      return {
        id: seller.id,
        username: seller.username ?? null,
        displayName: seller.displayName || seller.username || 'Seller',
        avatar: seller.avatar || null,
        bio: seller.bio || null,
        isVerified: !!seller.isVerified,
        isSeller: !!seller.isSeller,
        createdAt: new Date(seller.createdAt || Date.now()),
        rating: Number(seller.rating || 0),
        reviewCount: Number(seller.reviewCount || 0),
        numSales: Number(seller.numSales || 0),
        location: seller.location || null,
        lastOnline: seller.lastOnline ? new Date(seller.lastOnline) : null,
        followers: Number(seller.followers || 0),
        following: Number(seller.following || 0),
        isEmailVerified: !!seller.isEmailVerified,
        isPhoneVerified: !!seller.isPhoneVerified,
      };
    } catch {
      return null;
    }
  }, []);

  // Get seller's listings (real for UUID sellers, mock for demo sellers)
  const getSellerListings = useCallback(async (sellerId: string): Promise<Listing[]> => {
    const mockListings = getAllListings().filter((l) => l.sellerId === sellerId && l.status === 'active');

    if (!isUuid(sellerId)) return mockListings;

    try {
      const data = await request<{ items: SupabaseItemRow[] }>(`/sellers/${sellerId}/listings`, { auth: false });
      return (data.items || []).map((row) => transformItemToListing(row as unknown as SupabaseItemRow));
    } catch {
      return mockListings;
    }
  }, []);

  // Get seller's reviews (mock + real)
  const getSellerReviews = useCallback(async (sellerId: string): Promise<SellerReview[]> => {
    // Get mock reviews
    const mockSellerReviews = mockReviews
      .filter(r => r.sellerId === sellerId)
      .map(r => ({
        id: r.id,
        reviewerId: r.reviewerId,
        reviewerName: r.reviewerName,
        reviewerAvatar: r.reviewerAvatar,
        sellerId: r.sellerId,
        rating: r.rating,
        text: r.text,
        createdAt: r.createdAt,
      }));

    // API endpoint exists, but returns empty by default for now.
    return mockSellerReviews;
  }, []);

  return {
    getSellerById,
    getSellerListings,
    getSellerReviews,
  };
}
