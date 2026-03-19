import { Link, useNavigate } from 'react-router-dom';
import { Heart, Check, MoreVertical, Flag, Share2 } from 'lucide-react';
import { Listing } from '@/types';
import { cn } from '@/lib/utils';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ReportListingModal } from './ReportListingModal';
import { ShareModal } from './ShareModal';
import { toast } from '@/hooks/use-toast';
import { useShare } from '@/hooks/useShare';
import { generateSrcSet, getOptimalImageUrl } from '@/lib/imageUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ListingCardProps {
  listing: Listing;
  className?: string;
  priority?: boolean;
}

// Buyer Protection Fee: (Item Price * 0.05) + 0.50 GEL
const calculateBuyerProtectionFee = (price: number) => {
  return Math.round((price * 0.05 + 0.5) * 100) / 100;
};

export function ListingCard({ listing, className, priority = false }: ListingCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shareHook = useShare();

  // Local counter synced with listing data - no optimistic updates
  const [favoriteCount, setFavoriteCount] = useState<number>(listing.favoriteCount || 0);

  useEffect(() => {
    setFavoriteCount(listing.favoriteCount || 0);
  }, [listing.favoriteCount]);

  // Fallback placeholder image for when images fail to load
  const fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop';

  const handleFavoriteToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;

    // Check auth first - no UI changes if not authenticated
    if (!user) {
      toast({
        title: language === 'ka' ? 'შესვლა საჭიროა' : 'Login required',
        description: language === 'ka' 
          ? 'ფავორიტებში დასამატებლად გთხოვთ შეხვიდეთ ანგარიშში' 
          : 'Log in to save items to favorites',
      });
      navigate('/auth');
      return;
    }

    const wasFavorited = isFavorite(listing.id);
    
    setIsToggling(true);
    // Optimistic count update for instant feedback
    setFavoriteCount((prev) => Math.max(0, prev + (wasFavorited ? -1 : 1)));
    
    const result = await toggleFavorite(listing.id, listing.title);
    setIsToggling(false);
    
    // Revert count if backend failed
    if (!result.success) {
      setFavoriteCount((prev) => Math.max(0, prev + (wasFavorited ? 1 : -1)));
    }
  }, [isToggling, toggleFavorite, listing.id, listing.title, isFavorite, user, language, navigate]);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await shareHook.share({
      title: listing.title,
      price: listing.price,
      listingId: listing.id,
      imageUrl: listing.images?.[0]?.url,
    });
  }, [listing.id, listing.title, listing.price, listing.images, shareHook]);

  const favorited = isFavorite(listing.id);
  const totalWithFees = listing.price + calculateBuyerProtectionFee(listing.price);

  const conditionLabel = {
    'new': language === 'ka' ? 'ახალი' : 'New',
    'like-new': language === 'ka' ? 'თითქმის ახალი' : 'Like new',
    'good': language === 'ka' ? 'კარგი' : 'Good',
    'fair': language === 'ka' ? 'საშუალო' : 'Fair',
  };

  // Generate optimized srcset for responsive images
  const imageSrc = listing.images?.[0]?.url || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop`;
  const srcSet = useMemo(() => generateSrcSet(imageSrc, [300, 400, 600, 800]), [imageSrc]);
  const optimizedSrc = useMemo(() => getOptimalImageUrl(imageSrc, 400), [imageSrc]);

  // Sizes attribute: 2 cols mobile (~50vw), 3 cols tablet (~33vw), 4-5 cols desktop (~20vw)
  const sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw';

  return (
    <>
    <article className={cn("group", className)}>
      <Link to={`/listing/${listing.id}`} className="block">
        {/* Square image container - 1:1 aspect ratio */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          {/* Shimmer skeleton loader - shown until image loads */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 skeleton" />
          )}
          
          <img
            src={imageError ? fallbackImage : optimizedSrc}
            srcSet={imageError ? undefined : srcSet}
            sizes={imageError ? undefined : sizes}
            alt={listing.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03]",
              !imageLoaded && "opacity-0"
            )}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />

          {/* 3-dot menu - top right overlay */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/80 dark:bg-card/90 backdrop-blur-sm shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem 
                onClick={handleShare}
                className="text-muted-foreground"
              >
                <Share2 className="h-4 w-4 mr-2" />
                {language === 'ka' ? 'გაზიარება' : 'Share listing'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowReportModal(true);
                }}
                className="text-muted-foreground"
              >
                <Flag className="h-4 w-4 mr-2" />
                {language === 'ka' ? 'მოხსენება' : 'Report listing'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Favorite button with count - bottom right overlay */}
          <button
            onClick={handleFavoriteToggle}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={cn(
              "absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full",
              "bg-card/95 backdrop-blur-sm shadow-md transition-all duration-200",
              "hover:bg-card hover:scale-105 active:scale-95",
              favorited && "text-red-500"
            )}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                favorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
            <span className="text-xs font-medium">{favoriteCount}</span>
          </button>
        </div>


        {/* Item details - Vinted style like second image */}
        <div className="mt-2 px-0.5 space-y-0.5">
          {/* Brand name as main title */}
          <p className="text-sm font-medium text-foreground truncate">
            {listing.brand || listing.title}
          </p>

          {/* Size and Condition on second line */}
          <p className="text-xs text-muted-foreground truncate">
            {listing.size && <span>{listing.size}</span>}
            {listing.size && listing.condition && <span> · </span>}
            {listing.condition && <span>{conditionLabel[listing.condition]}</span>}
          </p>

          {/* Price - main price */}
          <p className="text-sm font-semibold text-foreground">
            ₾{listing.price.toFixed(2)}
          </p>

          {/* Total price with fees and heart icon */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>₾{totalWithFees.toFixed(2)} {language === 'ka' ? 'სულ' : 'incl.'}</span>
            <Check className="h-3 w-3 text-primary" />
          </div>
        </div>
      </Link>
    </article>
    
    <ReportListingModal 
      isOpen={showReportModal} 
      onClose={() => setShowReportModal(false)} 
      listingId={listing.id}
      sellerId={listing.sellerId}
      listingTitle={listing.title}
    />
    {shareHook.shareData && (
      <ShareModal
        isOpen={shareHook.showDesktopModal}
        onClose={() => shareHook.setShowDesktopModal(false)}
        title={shareHook.shareData.title}
        price={shareHook.shareData.price}
        url={shareHook.shareData.url}
        onCopyLink={shareHook.copyLink}
        onShareWhatsApp={shareHook.shareToWhatsApp}
        onShareMessenger={shareHook.shareToMessenger}
        onShareInstagram={shareHook.shareToInstagram}
      />
    )}
    </>
  );
}
