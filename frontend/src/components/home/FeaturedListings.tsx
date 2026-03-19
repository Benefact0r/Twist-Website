import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { ListingGridSkeleton } from '@/components/listing/ListingCardSkeleton';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeListingsQuery } from '@/hooks/useHomeListingsQuery';

export function FeaturedListings() {
  const { language } = useLanguage();
  const { newArrivals, loading } = useHomeListingsQuery();

  return (
    <section className="py-6 md:py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {language === 'ka' ? 'ახალი ნივთები' : 'New Items'}
          </h2>
          <Button variant="ghost" size="sm" className="text-sm" asChild>
            <Link to="/search?sort=newest" className="flex items-center gap-1">
              {language === 'ka' ? 'ყველა' : 'See all'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <ListingGridSkeleton count={5} />
        ) : (
          <ListingGrid listings={newArrivals} />
        )}
      </div>
    </section>
  );
}
