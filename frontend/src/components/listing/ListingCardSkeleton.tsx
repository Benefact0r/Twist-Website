import { cn } from '@/lib/utils';

interface ListingCardSkeletonProps {
  className?: string;
}

export function ListingCardSkeleton({ className }: ListingCardSkeletonProps) {
  return (
    <article className={cn("group", className)}>
      {/* Square image container skeleton */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <div className="absolute inset-0 skeleton" />
      </div>

      {/* Item details skeleton */}
      <div className="mt-2 px-0.5 space-y-2">
        {/* Brand name */}
        <div className="skeleton h-4 w-3/4 rounded" />
        
        {/* Size and condition */}
        <div className="skeleton h-3 w-1/2 rounded" />
        
        {/* Price */}
        <div className="skeleton h-4 w-1/3 rounded" />
        
        {/* Total price */}
        <div className="skeleton h-3 w-2/5 rounded" />
      </div>
    </article>
  );
}

interface ListingGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ListingGridSkeleton({ count = 8, className }: ListingGridSkeletonProps) {
  return (
    <div 
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  );
}
