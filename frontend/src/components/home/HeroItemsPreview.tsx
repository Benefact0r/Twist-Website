import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeListingsQuery } from '@/hooks/useHomeListingsQuery';
import { ListingCard } from '@/components/listing/ListingCard';
import { ListingCardSkeleton } from '@/components/listing/ListingCardSkeleton';
import { Button } from '@/components/ui/button';

export function HeroItemsPreview() {
  const { language } = useLanguage();
  const { featured, loading } = useHomeListingsQuery();

  if (loading) {
    return (
      <section className="bg-background py-6">
        <div className="container">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {language === 'ka' ? 'აღმოაჩინე' : 'Discover'}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {[...Array(8)].map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section className="bg-background py-6 border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {language === 'ka' ? 'აღმოაჩინე' : 'Discover'}
          </h2>
          <Button variant="ghost" size="sm" className="text-sm" asChild>
            <Link to="/search" className="flex items-center gap-1">
              {language === 'ka' ? 'ყველა' : 'See all'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {featured.map((item, index) => (
            <ListingCard
              key={item.id}
              listing={item}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
