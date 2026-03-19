import { useState, useCallback } from 'react';
import { request } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Offer {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  offered_amount: number;
  original_price: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'countered' | 'cancelled' | 'payment_completed';
  message?: string;
  counter_offer?: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export function useOffers() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createOffer = useCallback(async (
    listingId: string,
    sellerId: string,
    offeredAmount: number,
    originalPrice: number,
    message?: string
  ): Promise<Offer | null> => {
    if (!user) {
      toast({
        title: "შესვლა საჭიროა",
        description: "შეთავაზების გასაკეთებლად გთხოვთ შეხვიდეთ ანგარიშში",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    try {
      // Check for existing pending offer on this listing by this buyer
      const { offer: data } = await request<{ offer: Offer }>('/offers', {
        method: 'POST',
        body: {
          listing_id: listingId,
          seller_id: sellerId,
          offered_amount: offeredAmount,
          original_price: originalPrice,
          message: message || null,
        },
      });

      toast({
        title: "✓ შეთავაზება გაიგზავნა",
        description: `თქვენ შესთავაზეთ ₾${offeredAmount}`
      });

      return data as Offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: "შეცდომა",
        description: "შეთავაზების გაგზავნა ვერ მოხერხდა",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const getOfferById = useCallback(async (offerId: string): Promise<Offer | null> => {
    try {
      const { offer } = await request<{ offer: Offer }>(`/offers/${offerId}`);
      return offer;
    } catch (error) {
      console.error('Error fetching offer:', error);
      return null;
    }
  }, []);

  const getOffersForListing = useCallback(async (listingId: string): Promise<Offer[]> => {
    try {
      const data = await request<{ items: Offer[] }>(`/offers/listing/${listingId}`);
      return data.items || [];
    } catch (error) {
      console.error('Error fetching offers:', error);
      return [];
    }
  }, []);

  const getMyOffers = useCallback(async (): Promise<Offer[]> => {
    if (!user) return [];

    try {
      const data = await request<{ items: Offer[] }>(`/offers`);
      return data.items || [];
    } catch (error) {
      console.error('Error fetching my offers:', error);
      return [];
    }
  }, [user]);

  const updateOfferStatus = useCallback(async (
    offerId: string,
    status: 'accepted' | 'declined' | 'cancelled',
    counterOffer?: number
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await request(`/offers/${offerId}/status`, {
        method: 'PATCH',
        body: {
          status,
          counter_offer: counterOffer,
        },
      });

      const statusMessages: Record<string, string> = {
        accepted: 'შეთავაზება მიღებულია',
        declined: 'შეთავაზება უარყოფილია',
        cancelled: 'შეთავაზება გაუქმებულია',
        countered: 'კონტრშეთავაზება გაიგზავნა'
      };

      toast({
        title: statusMessages[counterOffer ? 'countered' : status],
      });

      return true;
    } catch (error) {
      console.error('Error updating offer:', error);
      toast({
        title: "შეცდომა",
        description: "შეთავაზების განახლება ვერ მოხერხდა",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    createOffer,
    getOfferById,
    getOffersForListing,
    getMyOffers,
    updateOfferStatus
  };
}
