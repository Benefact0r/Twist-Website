import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Listing } from '@/types';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateSrcSet, getOptimalImageUrl } from '@/lib/imageUtils';

interface SellerItemCardProps {
  listing: Listing;
  className?: string;
}

export function SellerItemCard({ 
  listing, 
  className 
}: SellerItemCardProps) {
  const { language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);

  const isListingFavorited = isFavorite(listing.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(listing.id);
  };

  const conditionLabel = {
    'new': language === 'ka' ? 'ახალი' : 'New',
    'like-new': language === 'ka' ? 'თითქმის ახალი' : 'Like new',
    'good': language === 'ka' ? 'კარგი' : 'Good',
    'fair': language === 'ka' ? 'საშუალო' : 'Fair',
  };

  // Generate optimized srcset for responsive images
  const imageSrc = listing.images[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400';
  const srcSet = useMemo(() => generateSrcSet(imageSrc, [300, 400, 600]), [imageSrc]);
  const optimizedSrc = useMemo(() => getOptimalImageUrl(imageSrc, 400), [imageSrc]);
  const blurPlaceholder = useMemo(() => `${imageSrc.split('?')[0]}?w=20&q=10`, [imageSrc]);
  const sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw';

  return (
    <article className={cn(
      "group relative rounded-xl border border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-md",
      className
    )}>
      <Link to={`/listing/${listing.id}`} className="block">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
          {/* Blur-up placeholder */}
          {!imageLoaded && (
            <img
              src={blurPlaceholder}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-up"
            />
          )}
          
          <img
            src={optimizedSrc}
            srcSet={srcSet}
            sizes={sizes}
            alt={listing.title}
            className={cn(
              "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
              !imageLoaded && "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400';
              setImageLoaded(true);
            }}
            loading="lazy"
            decoding="async"
          />

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              "hover:scale-110 active:scale-95",
              isListingFavorited 
                ? "bg-card/90" 
                : "bg-card/90 hover:bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart className={cn(
              "h-4 w-4 transition-colors duration-200",
              isListingFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-lg font-bold text-price">
              ₾{listing.price.toLocaleString()}
            </p>
            <Badge variant={listing.condition as any} className="text-[10px] shrink-0">
              {conditionLabel[listing.condition]}
            </Badge>
          </div>

          <h3 className="text-sm font-medium line-clamp-2 text-foreground/80">
            {listing.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {listing.size && <span>{listing.size}</span>}
            {listing.brand && (
              <>
                <span>•</span>
                <span>{listing.brand}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
