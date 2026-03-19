import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, CreditCard, MessageCircle, ChevronLeft, ChevronRight, Star, Shield, Truck, Check, Tag, Package, Loader2, Info, Flag, MapPin, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { generateSrcSet, getOptimalImageUrl } from '@/lib/imageUtils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllListings } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { formatDistanceToNow } from 'date-fns';
import { ka, enUS } from 'date-fns/locale';
import { OfferModal } from '@/components/listing/OfferModal';
import { BuyNowModal } from '@/components/listing/BuyNowModal';
import { SellerActionsPanel } from '@/components/listing/SellerActionsPanel';
import { ReportListingModal } from '@/components/listing/ReportListingModal';
import { ShareModal } from '@/components/listing/ShareModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import { useDemoSeller } from '@/hooks/useDemoSeller';
import { useToast } from '@/hooks/use-toast';
import { useShare } from '@/hooks/useShare';
import { useListing } from '@/hooks/useListing';
import { useSellerProfile, SellerData } from '@/hooks/useSellerProfile';
import { Skeleton } from '@/components/ui/skeleton';

// Buyer Protection Fee: (Item Price * 0.05) + 0.50 GEL
const calculateBuyerProtectionFee = (price: number) => {
  return Math.round((price * 0.05 + 0.5) * 100) / 100;
};

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const { getOrCreateConversation, sendMessage } = useConversations();
  const { getOrCreateDemoSeller } = useDemoSeller();
  const { toast } = useToast();
  const shareHook = useShare();
  const [currentImage, setCurrentImage] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const { getSellerById } = useSellerProfile();
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [sellerLoading, setSellerLoading] = useState(false);

  // Fetch listing from Supabase OR mock data
  const { listing, loading, error } = useListing(id);
  const mockListings = getAllListings();

  useEffect(() => {
    if (!listing?.sellerId) return;

    let cancelled = false;
    setSellerLoading(true);

    getSellerById(listing.sellerId)
      .then((data) => {
        if (cancelled) return;
        setSeller(data);
      })
      .catch((e) => {
        console.error('Error fetching seller:', e);
        if (!cancelled) setSeller(null);
      })
      .finally(() => {
        if (!cancelled) setSellerLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listing?.sellerId, getSellerById]);

  // Always have a resolved seller for display (fallback if data not loaded yet)
  const resolvedSeller = useMemo(() => {
    if (seller) return seller;
    // Fallback while loading or if seller data is missing
    const fallbackName = listing?.seller?.displayName || listing?.seller?.name || 'Seller';
    return {
      id: listing?.sellerId || '',
      displayName: fallbackName,
      username: fallbackName,
      avatar: listing?.seller?.avatar || null,
      rating: listing?.seller?.rating || 0,
      reviewCount: listing?.seller?.numReviews || 0,
      isVerified: listing?.seller?.isVerified || false,
      location: listing?.seller?.location || null,
      lastOnline: listing?.seller?.lastOnline || null,
      followers: listing?.seller?.followers || 0,
      following: listing?.seller?.following || 0,
      isEmailVerified: false,
      isPhoneVerified: false,
      bio: listing?.seller?.bio || null,
      joinedAt: new Date().toISOString(),
    };
  }, [seller, listing]);

  // Get seller's other items (excluding current listing)
  const sellerOtherItems = useMemo(() => {
    if (!listing) return [];
    return mockListings
      .filter((l) => l.sellerId === listing.sellerId && l.id !== listing.id)
      .slice(0, 8);
  }, [mockListings, listing]);


  const conditionLabel = {
    'new': language === 'ka' ? 'ახალი' : 'New with tags',
    'like-new': language === 'ka' ? 'თითქმის ახალი' : 'Like new',
    'good': language === 'ka' ? 'კარგი' : 'Good',
    'fair': language === 'ka' ? 'საშუალო' : 'Fair',
  };

  // Calculate prices (use defaults if listing not loaded)
  const deliveryCost = 5;
  const buyerProtectionFee = listing ? calculateBuyerProtectionFee(listing.price) : 0;
  const totalPrice = listing ? listing.price + deliveryCost + buyerProtectionFee : 0;

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS

  const handleMessageSeller = useCallback(async () => {
    if (!listing) return;
    if (!user) {
      navigate('/auth', { state: { from: `/listing/${id}` } });
      return;
    }

    if (user.id === listing.sellerId) {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'თქვენ ვერ დაუკავშირდებით საკუთარ თავს' : "You can't message yourself",
        variant: 'destructive'
      });
      return;
    }

    setIsStartingChat(true);
    try {
      const realSellerId = await getOrCreateDemoSeller(listing.sellerId);
      
      if (!realSellerId) {
        toast({
          title: language === 'ka' ? 'შეცდომა' : 'Error',
          description: language === 'ka' ? 'გამყიდველის პროფილი ვერ მოიძებნა' : 'Seller profile not found',
          variant: 'destructive'
        });
        setIsStartingChat(false);
        return;
      }

      const conversationId = await getOrCreateConversation(realSellerId, listing.id);
      
      if (conversationId) {
        await sendMessage(
          conversationId,
          `გამარჯობა! მაინტერესებს "${listing.title}" - ₾${listing.price}`,
          'text'
        );
        
        toast({
          title: language === 'ka' ? '✓ ჩატი დაიწყო' : '✓ Chat started',
          description: language === 'ka' 
            ? `ჩატი დაიწყო ${listing.seller?.displayName || listing.seller?.name}-სთან` 
            : `Chat started with ${listing.seller?.displayName || listing.seller?.name}`,
        });
        
        navigate(`/messages?chat=${conversationId}`);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'შეტყობინების გაგზავნა ვერ მოხერხდა' : 'Failed to start conversation',
        variant: 'destructive'
      });
    } finally {
      setIsStartingChat(false);
    }
  }, [user, listing, id, getOrCreateDemoSeller, getOrCreateConversation, sendMessage, navigate, toast, language]);

  const handleToggleFavorite = useCallback(async () => {
    if (!listing) return;
    if (!user) {
      navigate('/auth', { state: { from: `/listing/${id}` } });
      return;
    }
    if (isTogglingFavorite) return;
    setIsTogglingFavorite(true);
    await toggleFavorite(listing.id);
    setIsTogglingFavorite(false);
  }, [user, listing, toggleFavorite, navigate, id, isTogglingFavorite]);

  const handleShare = useCallback(async () => {
    if (!listing) return;
    
    await shareHook.share({
      title: listing.title,
      price: listing.price,
      listingId: listing.id,
      imageUrl: listing.images[0]?.url,
    });
  }, [listing, shareHook]);

  const handleBuyNow = useCallback(() => {
    if (!listing) return;
    if (!user) {
      navigate('/auth', { state: { from: `/listing/${id}` } });
      return;
    }
    setShowBuyNowModal(true);
  }, [user, listing, navigate, id]);

  const isListingFavorited = listing ? isFavorite(listing.id) : false;
  const isOwnListing = user && listing && user.id === listing.sellerId;

  // NOW we can have conditional returns (after all hooks)
  
  // Loading state
  if (loading) {
    return (
      <Layout hideBottomNav>
        <div className="container py-4 md:py-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Not found state
  if (error || !listing) {
    return (
      <Layout hideBottomNav>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'ka' ? 'ნივთი ვერ მოიძებნა' : 'Item not found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'ka' ? 'ეს ნივთი არ არსებობს ან წაშლილია' : 'This item does not exist or has been removed'}
          </p>
          <Button onClick={() => navigate('/')}>
            {language === 'ka' ? 'მთავარზე დაბრუნება' : 'Go to Home'}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideBottomNav>
      <div className="container py-4 md:py-8">
        {/* Desktop: Split layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          
          {/* Left: Photo Gallery */}
          <div className="space-y-3">
            {/* Main image - high resolution for detail inspection */}
            <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden">
              <img 
                src={getOptimalImageUrl(listing.images[currentImage]?.url, 1200)} 
                srcSet={generateSrcSet(listing.images[currentImage]?.url, [800, 1200, 1600, 2000])}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={listing.title} 
                className="w-full h-full object-cover" 
                loading="eager"
                decoding="async"
              />
              {listing.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : listing.images.length - 1))} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/95 hover:bg-card flex items-center justify-center shadow-md transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setCurrentImage((prev) => (prev < listing.images.length - 1 ? prev + 1 : 0))} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/95 hover:bg-card flex items-center justify-center shadow-md transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-card/95 text-sm font-medium shadow">
                {currentImage + 1} / {listing.images.length}
              </div>
            </div>

            {/* Thumbnail grid - optimized for small display */}
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.map((image, index) => (
                  <button 
                    key={image.id} 
                    onClick={() => setCurrentImage(index)} 
                    className={cn(
                      "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                      currentImage === index ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img 
                      src={getOptimalImageUrl(image.thumbnailUrl || image.url, 150)} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Checkout */}
          <div className="space-y-6">
            
            {/* Price Block - Prominent at top */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">
                    ₾{listing.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    + ₾{deliveryCost} {language === 'ka' ? 'მიტანა' : 'delivery'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                    className={cn(isListingFavorited && "text-secondary border-secondary")}
                  >
                    {isTogglingFavorite ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart className={cn("h-5 w-5", isListingFavorited && "fill-current")} />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                  {!isOwnListing && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setShowReportModal(true)}
                      className="text-muted-foreground hover:text-destructive hover:border-destructive"
                    >
                      <Flag className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Buyer Protection Trust Block */}
              <div className="mt-4 p-4 rounded-xl bg-muted/60 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {language === 'ka' ? 'მყიდველის დაცვა' : 'Buyer Protection'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'ka' 
                        ? `₾${buyerProtectionFee.toFixed(2)} • სრული დაბრუნება თუ არ მიიღეთ`
                        : `₾${buyerProtectionFee.toFixed(2)} fee • Full refund if not delivered`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Badges */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-3">{listing.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{conditionLabel[listing.condition]}</Badge>
                {listing.size && <Badge variant="outline">{listing.size}</Badge>}
                {listing.brand && <Badge variant="outline">{listing.brand}</Badge>}
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            {isOwnListing ? (
              /* Seller Actions Panel */
              <SellerActionsPanel 
                listingId={listing.id}
                currentStatus={listing.status}
                onStatusChange={() => navigate('/profile')}
              />
            ) : (
              /* Buyer Actions - Buy Now is PRIMARY */
              <div className="hidden md:flex flex-col gap-3">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold"
                  onClick={handleBuyNow}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {language === 'ka' ? 'იყიდე ახლავე' : 'Buy Now'} • ₾{totalPrice.toFixed(2)}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg" onClick={() => setShowOfferModal(true)}>
                    <Tag className="h-5 w-5 mr-2" />
                    {language === 'ka' ? 'შეთავაზება' : 'Make offer'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    onClick={handleMessageSeller}
                    disabled={isStartingChat}
                  >
                    {isStartingChat ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <MessageCircle className="h-5 w-5 mr-2" />
                    )}
                    {language === 'ka' ? 'შეტყობინება' : 'Message'}
                  </Button>
                </div>
                
                {/* Single item purchase notice */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>
                    {language === 'ka' 
                      ? 'თითოეული ნივთი იყიდება ცალკე' 
                      : 'Each item is purchased separately'}
                  </span>
                </div>
              </div>
            )}

            {/* Seller (always visible) */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold">
                {language === 'ka' ? 'გამყიდველი' : 'Seller'}
              </h2>
              <Link
                to={`/seller/${listing.sellerId}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <img
                  src={
                    resolvedSeller.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedSeller.displayName)}&background=random`
                  }
                  alt={resolvedSeller.displayName}
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-muted group-hover:ring-primary/30 transition-all shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {sellerLoading ? (language === 'ka' ? 'იტვირთება…' : 'Loading…') : resolvedSeller.displayName}
                    </h3>
                    {resolvedSeller.isVerified && !sellerLoading && (
                      <span className="shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-3 w-3',
                            star <= Math.round(resolvedSeller.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground/30'
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-1">
                      {resolvedSeller.reviewCount > 0 ? resolvedSeller.reviewCount : 0}
                    </span>
                  </div>

                  {resolvedSeller.location && !sellerLoading && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{resolvedSeller.location}</span>
                    </div>
                  )}

                  {resolvedSeller.lastOnline && !sellerLoading && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>
                        {language === 'ka' ? 'ონლაინ იყო: ' : 'Last online: '}
                        {formatDistanceToNow(resolvedSeller.lastOnline, {
                          addSuffix: true,
                          locale: language === 'ka' ? ka : enUS,
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
              </Link>
            </div>

            {/* Delivery info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-light">
              <Truck className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  {language === 'ka' ? 'კარიდან კარამდე მიტანა' : 'Door-to-door delivery'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ka' ? '2-4 დღეში' : 'Arrives in 2-4 days'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold mb-2">
                {language === 'ka' ? 'აღწერა' : 'Description'}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">{language === 'ka' ? 'მდგომარეობა' : 'Condition'}</p>
                <p className="font-medium text-sm mt-0.5">{conditionLabel[listing.condition]}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">{language === 'ka' ? 'ზომა' : 'Size'}</p>
                <p className="font-medium text-sm mt-0.5">{listing.size || (language === 'ka' ? 'უნივერსალური' : 'One Size')}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">{language === 'ka' ? 'ბრენდი' : 'Brand'}</p>
                <p className="font-medium text-sm mt-0.5">{listing.brand || '—'}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-xs text-muted-foreground">{language === 'ka' ? 'ნახვები' : 'Views'}</p>
                <p className="font-medium text-sm mt-0.5">{listing.viewCount}</p>
              </div>
            </div>

          </div>
        </div>

        {/* More from this seller section */}
        {sellerOtherItems.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {language === 'ka' 
                      ? `სხვა ნივთები ${listing.seller?.displayName}-ისგან` 
                      : `More from ${listing.seller?.displayName}`}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ka' 
                      ? 'დაათვალიერე მეტი ნივთი ამ გამყიდველისგან' 
                      : 'Browse more items from this seller'}
                  </p>
                </div>
              </div>
              <Link 
                to={`/seller/${listing.sellerId}`}
                className="text-sm text-primary hover:underline font-medium"
              >
                {language === 'ka' ? 'ყველას ნახვა' : 'View all'}
              </Link>
            </div>
            
            <ListingGrid listings={sellerOtherItems.slice(0, 4)} />
          </section>
        )}

      </div>

      {/* Mobile Sticky Bottom Bar - Buy + Offer (only for buyers) */}
      {!isOwnListing && (
        <div className="sticky-price-bar md:hidden">
          <div className="container flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xl font-bold">₾{listing.price}</p>
              <p className="text-xs text-muted-foreground">
                + ₾{deliveryCost} {language === 'ka' ? 'მიტანა' : 'delivery'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="lg"
                className="px-5"
                onClick={() => setShowOfferModal(true)}
              >
                <Tag className="h-5 w-5 mr-2" />
                {language === 'ka' ? 'შეთავაზება' : 'Offer'}
              </Button>
              <Button
                size="lg"
                className="px-6 font-bold"
                onClick={handleBuyNow}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {language === 'ka' ? 'იყიდე' : 'Buy'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <OfferModal listing={listing} isOpen={showOfferModal} onClose={() => setShowOfferModal(false)} />
      <BuyNowModal listing={listing} isOpen={showBuyNowModal} onClose={() => setShowBuyNowModal(false)} />
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
    </Layout>
  );
}
