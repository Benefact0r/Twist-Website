import { memo } from 'react';
import { Listing } from '@/types';
import { ListingCard } from './ListingCard';
import { ListingGridSkeleton } from './ListingCardSkeleton';
import { cn } from '@/lib/utils';

interface ListingGridProps {
  listings: Listing[];
  className?: string;
  loading?: boolean;
  showSkeletonOnEmpty?: boolean;
  skeletonCount?: number;
}

// Memoized ListingCard for performance
const MemoizedListingCard = memo(ListingCard);

export function ListingGrid({ 
  listings, 
  className, 
  loading = false, 
  showSkeletonOnEmpty = true,
  skeletonCount = 8,
}: ListingGridProps) {
  // Show skeleton when loading with no data
  if (loading && listings.length === 0) {
    return <ListingGridSkeleton count={skeletonCount} className={className} />;
  }

  // Empty state
  if (!loading && listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4",
        className
      )}
    >
      {listings.map((listing, index) => (
        <MemoizedListingCard 
          key={listing.id} 
          listing={listing} 
          // Only first item is priority (LCP optimization)
          priority={index === 0}
        />
      ))}
    </div>
  );
}