import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { request } from '@/lib/apiClient';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FavoritesContextType {
  favorites: string[];
  validFavoritesCount: number;
  isLoading: boolean;
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listingId: string, listingTitle?: string) => Promise<{ success: boolean; requiresAuth?: boolean }>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [validFavorites, setValidFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setValidFavorites([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await request<{ items: Array<{ listing_id: string }> }>('/favorites');
      const allFavIds = data.items?.map(f => f.listing_id) || [];
      setFavorites(allFavIds);
      setValidFavorites(allFavIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Badge count: only favorites with existing items
  const validFavoritesCount = useMemo(() => validFavorites.length, [validFavorites]);

  const isFavorite = useCallback((listingId: string) => {
    return favorites.includes(listingId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (listingId: string, listingTitle?: string): Promise<{ success: boolean; requiresAuth?: boolean }> => {
    if (!user) {
      return { success: false, requiresAuth: true };
    }

    const isCurrentlyFavorite = favorites.includes(listingId);

    // Optimistic update
    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter(id => id !== listingId));
      setValidFavorites(prev => prev.filter(id => id !== listingId));
    } else {
      setFavorites(prev => [...prev, listingId]);
      setValidFavorites(prev => [...prev, listingId]);
    }

    try {
      if (isCurrentlyFavorite) {
        await request<void>(`/favorites/${listingId}`, { method: 'DELETE' });

        toast({
          title: "წაიშალა ფავორიტებიდან",
          description: listingTitle || "ნივთი წაიშალა ფავორიტებიდან"
        });
      } else {
        await request<void>(`/favorites/${listingId}`, { method: 'POST' });

        toast({
          title: "დაემატა ფავორიტებში",
          description: listingTitle || "ნივთი დაემატა ფავორიტებში"
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Rollback
      if (isCurrentlyFavorite) {
        setFavorites(prev => [...prev, listingId]);
        setValidFavorites(prev => [...prev, listingId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== listingId));
        setValidFavorites(prev => prev.filter(id => id !== listingId));
      }
      toast({
        title: "შეცდომა",
        description: "ფავორიტების განახლება ვერ მოხერხდა",
        variant: "destructive"
      });
      return { success: false };
    }
  }, [user, favorites, toast]);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      validFavoritesCount,
      isLoading,
      isFavorite,
      toggleFavorite,
      refreshFavorites: fetchFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
