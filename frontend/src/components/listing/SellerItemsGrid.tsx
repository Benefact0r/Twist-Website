import { Listing } from '@/types';
import { SellerItemCard } from './SellerItemCard';

interface SellerItemsGridProps {
  listings: Listing[];
  className?: string;
}

export function SellerItemsGrid({ listings, className }: SellerItemsGridProps) {
  if (listings.length === 0) return null;

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {listings.map((listing) => (
          <SellerItemCard
            key={listing.id}
            listing={listing}
          />
        ))}
      </div>
    </div>
  );
}
