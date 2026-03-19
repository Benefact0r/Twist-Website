import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Shield, Calendar, Package, ChevronLeft, MessageCircle, User, MapPin, Clock, Users, Mail, Phone, Check, ChevronRight, Bell, BellOff } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSellerProfile, SellerData, SellerReview } from '@/hooks/useSellerProfile';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Listing } from '@/types';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ka, enUS } from 'date-fns/locale';
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= Math.round(rating) 
              ? 'fill-amber-400 text-amber-400' 
              : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, language }: { review: SellerReview; language: string }) {
  const locale = language === 'ka' ? ka : enUS;
  
  return (
    <div className="flex items-start gap-3 py-4 border-b border-border last:border-0">
      <Avatar className="h-10 w-10 shrink-0">
        {review.reviewerAvatar ? (
          <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
        ) : null}
        <AvatarFallback className="text-sm">
          {review.reviewerName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="font-medium text-sm">{review.reviewerName}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(review.createdAt, { addSuffix: true, locale })}
          </span>
        </div>
        <StarRating rating={review.rating} size="sm" />
        {review.text && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{review.text}</p>
        )}
      </div>
    </div>
  );
}

export default function SellerProfile() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { getSellerById, getSellerListings, getSellerReviews } = useSellerProfile();
  const { getOrCreateConversation } = useConversations();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'members' | 'auto'>('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadSellerData() {
      if (!id) return;

      setLoading(true);
      try {
        const [sellerData, listingsData, reviewsData] = await Promise.all([
          getSellerById(id),
          getSellerListings(id),
          getSellerReviews(id),
        ]);

        setSeller(sellerData);
        setListings(listingsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading seller:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSellerData();
  }, [id, getSellerById, getSellerListings, getSellerReviews]);

  const locale = language === 'ka' ? ka : enUS;

  // Calculate rating breakdown (all mock reviews are "member" reviews for now)
  const memberReviews = reviews;
  const autoReviews: SellerReview[] = []; // Future: system-generated reviews after transactions

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'members') return memberReviews;
    if (reviewFilter === 'auto') return autoReviews;
    return reviews;
  }, [reviews, memberReviews, autoReviews, reviewFilter]);

  // Handle message button click
  const handleMessage = async () => {
    if (!user) {
      toast({
        title: language === 'ka' ? 'გთხოვთ გაიაროთ ავტორიზაცია' : 'Please log in',
        description: language === 'ka' ? 'შეტყობინების გასაგზავნად საჭიროა ავტორიზაცია' : 'You need to be logged in to send messages',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!id) return;

    setActionLoading(true);
    try {
      const conversationId = await getOrCreateConversation(id);
      if (conversationId) {
        navigate(`/messages?conversation=${conversationId}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'შეტყობინების გაგზავნა ვერ მოხერხდა' : 'Failed to start conversation',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle follow button click
  const handleFollow = () => {
    if (!user) {
      toast({
        title: language === 'ka' ? 'გთხოვთ გაიაროთ ავტორიზაცია' : 'Please log in',
        description: language === 'ka' ? 'გამოწერისთვის საჭიროა ავტორიზაცია' : 'You need to be logged in to follow sellers',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing 
        ? (language === 'ka' ? 'გამოწერა გაუქმებულია' : 'Unfollowed')
        : (language === 'ka' ? 'გამოწერილია' : 'Following'),
      description: isFollowing
        ? (language === 'ka' ? `თქვენ აღარ მიყვებით ${seller?.displayName}-ს` : `You unfollowed ${seller?.displayName}`)
        : (language === 'ka' ? `თქვენ მიყვებით ${seller?.displayName}-ს` : `You are now following ${seller?.displayName}`),
    });
  };

  // Handle notify button click
  const handleNotify = () => {
    if (!user) {
      toast({
        title: language === 'ka' ? 'გთხოვთ გაიაროთ ავტორიზაცია' : 'Please log in',
        description: language === 'ka' ? 'შეტყობინებებისთვის საჭიროა ავტორიზაცია' : 'You need to be logged in to enable notifications',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setIsNotifying(!isNotifying);
    toast({
      title: isNotifying 
        ? (language === 'ka' ? 'შეტყობინებები გამორთულია' : 'Notifications disabled')
        : (language === 'ka' ? 'შეტყობინებები ჩართულია' : 'Notifications enabled'),
      description: isNotifying
        ? (language === 'ka' ? `თქვენ აღარ მიიღებთ შეტყობინებებს ${seller?.displayName}-ზე` : `You will no longer receive notifications about ${seller?.displayName}`)
        : (language === 'ka' ? `თქვენ მიიღებთ შეტყობინებებს ${seller?.displayName}-ის ახალ განცხადებებზე` : `You will be notified when ${seller?.displayName} posts new listings`),
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-6 md:py-10 max-w-4xl">
          <Skeleton className="h-6 w-20 mb-6" />
          <div className="flex items-start gap-4 mb-8">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-10 w-full mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square rounded-xl" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (!seller) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'ka' ? 'გამყიდველი ვერ მოიძებნა' : 'Seller not found'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'ka' 
              ? 'ეს პროფილი არ არსებობს ან წაშლილია' 
              : 'This profile does not exist or has been removed'}
          </p>
          <Button asChild>
            <Link to="/">
              {language === 'ka' ? 'მთავარზე დაბრუნება' : 'Go to Home'}
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6 md:py-10 max-w-4xl">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link to="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {language === 'ka' ? 'უკან' : 'Back'}
          </Link>
        </Button>

        {/* Seller Header - Vinted Style */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Left: Avatar */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 ring-4 ring-muted">
              {seller.avatar ? (
                <AvatarImage src={seller.avatar} alt={seller.displayName} />
              ) : null}
              <AvatarFallback className="text-3xl bg-muted">
                {seller.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Right: Info */}
          <div className="flex-1 text-center md:text-left">
            {/* Username and Rating Row */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
              <h1 className="text-2xl font-bold">{seller.displayName}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <StarRating rating={seller.rating} />
                <span className="font-medium">{seller.rating.toFixed(1)}</span>
                <button 
                  onClick={() => { setActiveTab('reviews'); }}
                  className="text-sm text-muted-foreground hover:text-primary underline underline-offset-2"
                >
                  ({seller.reviewCount} {language === 'ka' ? 'შეფასება' : 'reviews'})
                </button>
              </div>
            </div>

            {/* About Me Section */}
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              {seller.location && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{seller.location}</span>
                </div>
              )}
              {seller.lastOnline && (
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>
                    {language === 'ka' ? 'ონლაინ იყო: ' : 'Last online: '}
                    {formatDistanceToNow(seller.lastOnline, { addSuffix: true, locale })}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Users className="h-4 w-4 shrink-0" />
                <span>
                  {seller.followers} {language === 'ka' ? 'მიმდევარი' : 'Followers'}, {seller.following} {language === 'ka' ? 'მიყვება' : 'Following'}
                </span>
              </div>
            </div>

            {/* Bio */}
            {seller.bio && (
              <p className="text-muted-foreground mb-4 max-w-xl mx-auto md:mx-0">{seller.bio}</p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Button 
                variant="outline" 
                className="gap-2 rounded-full"
                onClick={handleNotify}
                disabled={actionLoading}
              >
                {isNotifying ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                {language === 'ka' ? 'შეტყობინება' : 'Notify'}
              </Button>
              <Button 
                variant={isFollowing ? "outline" : "default"}
                className="gap-2 rounded-full"
                onClick={handleFollow}
                disabled={actionLoading}
              >
                <Users className="h-4 w-4" />
                {isFollowing 
                  ? (language === 'ka' ? 'გამოწერილია' : 'Following')
                  : (language === 'ka' ? 'გამოწერა' : 'Follow')
                }
              </Button>
              <Button 
                variant="outline" 
                className="gap-2 rounded-full"
                onClick={handleMessage}
                disabled={actionLoading}
              >
                <MessageCircle className="h-4 w-4" />
                {language === 'ka' ? 'შეტყობინება' : 'Message'}
              </Button>
            </div>
          </div>
        </div>

        {/* Verified Information Section */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border mb-8">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            {language === 'ka' ? 'დადასტურებული ინფორმაცია' : 'Verified information'}
          </h3>
          <div className="flex flex-wrap gap-4">
            {seller.isEmailVerified && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{language === 'ka' ? 'ელფოსტა' : 'Email'}</span>
              </div>
            )}
            {seller.isPhoneVerified && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{language === 'ka' ? 'ტელეფონი' : 'Phone'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6 h-12">
            <TabsTrigger value="listings" className="gap-2 text-sm">
              <Package className="h-4 w-4" />
              {language === 'ka' ? 'განცხადებები' : 'Listings'}
              <Badge variant="secondary" className="ml-1 text-xs">{listings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2 text-sm">
              <Star className="h-4 w-4" />
              {language === 'ka' ? 'შეფასებები' : 'Reviews'}
              <Badge variant="secondary" className="ml-1 text-xs">{reviews.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2 text-sm">
              <User className="h-4 w-4" />
              {language === 'ka' ? 'შესახებ' : 'About'}
            </TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings" className="mt-0">
            {listings.length > 0 ? (
              <ListingGrid listings={listings} />
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  {language === 'ka' ? 'განცხადებები არ არის' : 'No listings yet'}
                </p>
                <p className="text-sm">
                  {language === 'ka' 
                    ? 'ამ გამყიდველს ჯერ არ აქვს აქტიური განცხადებები' 
                    : 'This seller has no active listings'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab - Vinted Style */}
          <TabsContent value="reviews" className="mt-0">
            {reviews.length > 0 ? (
              <div className="max-w-2xl">
                {/* Rating Summary */}
                <div className="flex items-center gap-6 p-6 rounded-xl bg-muted/30 border border-border mb-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-foreground">{seller.rating.toFixed(1)}</p>
                    <StarRating rating={seller.rating} size="lg" />
                    <p className="text-sm text-muted-foreground mt-1">({seller.reviewCount})</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {language === 'ka' ? 'მომხმარებლების შეფასებები' : 'Member ratings'}
                      </span>
                      <div className="flex items-center gap-2">
                        <StarRating rating={seller.rating} size="sm" />
                        <span className="font-medium">({memberReviews.length})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {language === 'ka' ? 'ავტომატური შეფასებები' : 'Automatic ratings'}
                      </span>
                      <div className="flex items-center gap-2">
                        <StarRating rating={5} size="sm" />
                        <span className="font-medium">({autoReviews.length})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  <Button
                    variant={reviewFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReviewFilter('all')}
                    className="shrink-0"
                  >
                    {language === 'ka' ? 'ყველა' : 'All'} ({reviews.length})
                  </Button>
                  <Button
                    variant={reviewFilter === 'members' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReviewFilter('members')}
                    className="shrink-0"
                  >
                    {language === 'ka' ? 'მომხმარებლების' : 'From members'} ({memberReviews.length})
                  </Button>
                  <Button
                    variant={reviewFilter === 'auto' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReviewFilter('auto')}
                    className="shrink-0"
                  >
                    {language === 'ka' ? 'ავტომატური' : 'Automatically'} ({autoReviews.length})
                  </Button>
                </div>

                {/* Reviews List */}
                <div className="space-y-0">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map(review => (
                      <ReviewCard key={review.id} review={review} language={language} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>{language === 'ka' ? 'ამ ფილტრით შეფასებები არ მოიძებნა' : 'No reviews found with this filter'}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  {language === 'ka' ? 'შეფასებები არ არის' : 'No reviews yet'}
                </p>
                <p className="text-sm">
                  {language === 'ka' 
                    ? 'ამ გამყიდველს ჯერ არ აქვს შეფასებები' 
                    : 'This seller has no reviews yet'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}