import { Heart, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { request } from '@/lib/apiClient';
import { Listing, ListingCondition, ListingImage } from '@/types';

// Map database condition to frontend type
const mapCondition = (dbCondition: string): ListingCondition => {
  const conditionMap: Record<string, ListingCondition> = {
    'new': 'new',
    'like_new': 'like-new',
    'like-new': 'like-new',
    'good': 'good',
    'fair': 'fair',
    'poor': 'fair',
  };
  return conditionMap[dbCondition] || 'good';
};

type FavoriteApiItem = {
  listing_id: string;
  listing: {
    id: string;
    title: string;
    price: number;
    category: string;
    condition: string;
    images: string[];
    status: string;
  };
};

export default function Favorites() {
  const { language } = useLanguage();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  // Fetch actual listings from backend when favorites change
  useEffect(() => {
    const fetchFavoritedListings = async () => {
      if (favorites.length === 0) {
        setListings([]);
        return;
      }

      setListingsLoading(true);
      try {
        const data = await request<{ items: FavoriteApiItem[] }>('/favorites');
        const favoriteItems = data.items || [];

        // Transform backend favorites payload to Listing type
        const transformedListings: Listing[] = favoriteItems.map((favorite) => {
          const item = favorite.listing;
          const images: ListingImage[] = (item.images || []).map((url: string, index: number) => ({
            id: `img-${item.id}-${index}`,
            url,
            thumbnailUrl: url,
            order: index,
          }));

          // Fallback image if no images
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
            sellerId: '',
            title: item.title,
            description: '',
            price: item.price,
            currency: 'GEL',
            categoryId: item.category || '',
            condition: mapCondition(item.condition),
            tags: [],
            images,
            status: item.status === 'active' ? 'active' : item.status === 'sold' ? 'sold' : 'archived',
            viewCount: 0,
            favoriteCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        });

        setListings(transformedListings);
      } catch (err) {
        console.error('Error in fetchFavoritedListings:', err);
        setListings([]);
      } finally {
        setListingsLoading(false);
      }
    };

    if (user) {
      fetchFavoritedListings();
    }
  }, [favorites, user]);

  const isLoading = favoritesLoading || listingsLoading;

  if (!user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {language === 'ka' ? 'შესვლა საჭიროა' : 'Login Required'}
            </h1>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {language === 'ka' 
                ? 'ფავორიტების სანახავად გთხოვთ შეხვიდეთ ანგარიშში' 
                : 'Please login to view your favorites'}
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">
                {language === 'ka' ? 'შესვლა' : 'Login'}
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  if (listings.length === 0) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {language === 'ka' ? 'ფავორიტები ცარიელია' : 'No favorites yet'}
            </h1>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {language === 'ka' 
                ? 'შეინახე ნივთები გულზე დაჭერით' 
                : 'Save items you love by tapping the heart icon'}
            </p>
            <Button size="lg" asChild>
              <Link to="/search">
                {language === 'ka' ? 'ნივთების ნახვა' : 'Discover Items'}
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-4 md:py-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold">
            {language === 'ka' ? `ფავორიტები (${listings.length})` : `Favorites (${listings.length})`}
          </h1>
        </div>

        <ListingGrid listings={listings} />
      </div>
    </Layout>
  );
}
