import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, RefreshCw, CreditCard, Clock, Loader2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOffers, Offer } from '@/hooks/useOffers';
import { formatDistanceToNow } from 'date-fns';
import { ka, enUS } from 'date-fns/locale';
import { getListingById } from '@/data/mockData';

interface OfferMessageData {
  type: 'offer';
  offerId: string;
  offerAmount: number;
  originalPrice: number;
  message?: string | null;
}

interface OfferMessageCardProps {
  content: string;
  isOwnMessage: boolean;
  timestamp: string;
  offerId?: string;
  onOfferUpdate?: () => void;
}

export function OfferMessageCard({ 
  content, 
  isOwnMessage, 
  timestamp,
  offerId,
  onOfferUpdate 
}: OfferMessageCardProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getOfferById, updateOfferStatus, isLoading } = useOffers();
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');
  const [offerData, setOfferData] = useState<OfferMessageData | null>(null);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  // Parse the JSON content
  useEffect(() => {
    try {
      const parsed = JSON.parse(content) as OfferMessageData;
      if (parsed.type === 'offer') {
        setOfferData(parsed);
      }
    } catch {
      // Not valid JSON, will show fallback
      setOfferData(null);
    }
  }, [content]);

  // Fetch offer details
  useEffect(() => {
    const fetchOffer = async () => {
      const id = offerId || offerData?.offerId;
      if (id) {
        setIsLoadingOffer(true);
        const fetchedOffer = await getOfferById(id);
        setOffer(fetchedOffer);
        setIsLoadingOffer(false);
      }
    };
    fetchOffer();
  }, [offerId, offerData?.offerId, getOfferById]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // If we can't parse the JSON, show a simple fallback
  if (!offerData) {
    return (
      <div className={cn(
        "max-w-[85%] md:max-w-[75%] p-4 rounded-xl bg-primary/10 border border-primary/20",
        isOwnMessage ? "rounded-br-md" : "rounded-bl-md"
      )}>
        <p className="text-sm font-medium mb-1">
          {language === 'ka' ? '💰 შეთავაზება' : '💰 Offer'}
        </p>
        <p className="text-xs text-muted-foreground">{formatTime(timestamp)}</p>
      </div>
    );
  }

  const isSeller = offer?.seller_id === user?.id;
  const isBuyer = offer?.buyer_id === user?.id || isOwnMessage;
  const offerAmount = offer?.offered_amount || offerData.offerAmount;
  const originalPrice = offer?.original_price || offerData.originalPrice;
  const offerMessage = offer?.message || offerData.message;
  const discount = Math.round((1 - offerAmount / originalPrice) * 100);
  
  const isExpired = offer ? new Date(offer.expires_at) < new Date() : false;
  const expiresIn = offer ? formatDistanceToNow(new Date(offer.expires_at), {
    addSuffix: true,
    locale: language === 'ka' ? ka : enUS
  }) : null;

  const handleAccept = async () => {
    if (!offer) return;
    const success = await updateOfferStatus(offer.id, 'accepted');
    if (success) {
      setOffer({ ...offer, status: 'accepted' });
      onOfferUpdate?.();
    }
  };

  const handleDecline = async () => {
    if (!offer) return;
    const success = await updateOfferStatus(offer.id, 'declined');
    if (success) {
      setOffer({ ...offer, status: 'declined' });
      onOfferUpdate?.();
    }
  };

  const handleCounter = async () => {
    if (!offer) return;
    const amount = parseFloat(counterAmount);
    if (amount <= 0 || amount > originalPrice) return;
    
    const success = await updateOfferStatus(offer.id, 'declined', amount);
    if (success) {
      setOffer({ ...offer, status: 'countered', counter_offer: amount });
      setShowCounterInput(false);
      setCounterAmount('');
      onOfferUpdate?.();
    }
  };

  const handlePayNow = () => {
    if (offer) {
      navigate(`/checkout/offer/${offer.id}`);
    }
  };

  const getStatusBadge = () => {
    if (!offer) return null;
    
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { 
        label: language === 'ka' ? 'მოლოდინში' : 'Pending', 
        className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
      },
      accepted: { 
        label: language === 'ka' ? 'მიღებული' : 'Accepted', 
        className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
      },
      declined: { 
        label: language === 'ka' ? 'უარყოფილი' : 'Declined', 
        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
      },
      expired: { 
        label: language === 'ka' ? 'ვადაგასული' : 'Expired', 
        className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' 
      },
      countered: { 
        label: language === 'ka' ? 'კონტრშეთავაზება' : 'Countered', 
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
      },
    };
    
    const status = isExpired && offer.status === 'pending' ? 'expired' : offer.status;
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", config.className)}>
        {config.label}
      </span>
    );
  };

  return (
    <div className={cn(
      "max-w-[85%] md:max-w-[75%] rounded-xl overflow-hidden",
      isOwnMessage ? "rounded-br-md" : "rounded-bl-md"
    )}>
      <div className={cn(
        "p-4 rounded-xl border-2",
        offer?.status === 'accepted' ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800" :
        offer?.status === 'declined' ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" :
        offer?.status === 'countered' ? "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800" :
        "bg-card border-border"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {language === 'ka' ? 'შეთავაზება' : 'Offer'}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {formatTime(timestamp)}
              </p>
            </div>
          </div>
          {isLoadingOffer ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            getStatusBadge()
          )}
        </div>

        {/* Price Info */}
        <div className="bg-muted/50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">₾{offerAmount}</p>
              <p className="text-xs text-muted-foreground">
                {language === 'ka' ? 'ორიგინალი' : 'Original'}: ₾{originalPrice}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                -{discount}%
              </span>
            </div>
          </div>
          
          {offer?.counter_offer && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">
                {language === 'ka' ? 'კონტრშეთავაზება' : 'Counter offer'}
              </p>
              <p className="text-xl font-bold text-primary">₾{offer.counter_offer}</p>
            </div>
          )}
        </div>

        {/* Message */}
        {offerMessage && (
          <p className="text-sm text-muted-foreground italic mb-3 px-1">
            "{offerMessage}"
          </p>
        )}

        {/* Expiry */}
        {offer?.status === 'pending' && !isExpired && expiresIn && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Clock className="h-3.5 w-3.5" />
            <span>{language === 'ka' ? 'იწურება' : 'Expires'} {expiresIn}</span>
          </div>
        )}

        {/* Seller Actions */}
        {offer?.status === 'pending' && !isExpired && isSeller && !isBuyer && (
          <div className="space-y-2">
            {!showCounterInput ? (
              <div className="flex gap-2">
                <Button 
                  onClick={handleAccept} 
                  disabled={isLoading}
                  className="flex-1"
                  size="sm"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                  {language === 'ka' ? 'მიღება' : 'Accept'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCounterInput(true)}
                  disabled={isLoading}
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {language === 'ka' ? 'კონტრი' : 'Counter'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleDecline}
                  disabled={isLoading}
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₾</span>
                    <Input
                      type="number"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(e.target.value)}
                      placeholder={`${offerAmount + 1} - ${originalPrice}`}
                      className="pl-7"
                      min={offerAmount + 1}
                      max={originalPrice}
                    />
                  </div>
                  <Button onClick={handleCounter} disabled={isLoading || !counterAmount} size="sm">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (language === 'ka' ? 'გაგზავნა' : 'Send')}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowCounterInput(false)} size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ka' ? 'შემოთავაზეთ ფასი' : 'Suggest a price'} (₾{offerAmount + 1} - ₾{originalPrice})
                </p>
              </div>
            )}
          </div>
        )}

        {/* Buyer waiting status */}
        {offer?.status === 'pending' && !isExpired && isBuyer && !isSeller && (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground">
              {language === 'ka' ? '⏳ გამყიდველის პასუხს ველოდებით...' : '⏳ Waiting for seller response...'}
            </p>
          </div>
        )}

        {/* Countered - Buyer actions */}
        {offer?.status === 'countered' && isBuyer && offer.counter_offer && (
          <div className="space-y-2">
            <p className="text-sm text-center font-medium">
              {language === 'ka' 
                ? `გამყიდველმა შემოგთავაზათ ₾${offer.counter_offer}` 
                : `Seller countered with ₾${offer.counter_offer}`}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleAccept} disabled={isLoading} className="flex-1" size="sm">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                {language === 'ka' ? 'მიღება' : 'Accept'} ₾{offer.counter_offer}
              </Button>
              <Button variant="ghost" onClick={handleDecline} disabled={isLoading} size="sm" className="text-destructive hover:text-destructive">
                <X className="h-4 w-4 mr-1" />
                {language === 'ka' ? 'უარყოფა' : 'Decline'}
              </Button>
            </div>
          </div>
        )}

        {/* Accepted - Buyer can pay */}
        {offer?.status === 'accepted' && isBuyer && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <Check className="h-5 w-5" />
              {language === 'ka' ? 'შეთავაზება მიღებულია!' : 'Offer Accepted!'}
            </div>
            <Button onClick={handlePayNow} className="w-full" size="sm">
              <CreditCard className="h-4 w-4 mr-2" />
              {language === 'ka' ? 'გადახდა' : 'Pay Now'} • ₾{offer.counter_offer || offer.offered_amount}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              {language === 'ka' ? '⏰ გადახდა 24 საათში' : '⏰ Complete payment within 24 hours'}
            </p>
          </div>
        )}

        {/* Accepted - Seller view */}
        {offer?.status === 'accepted' && isSeller && !isBuyer && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <Check className="h-5 w-5" />
              {language === 'ka' ? 'თქვენ მიიღეთ შეთავაზება' : 'You accepted this offer'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ka' ? 'მყიდველს გადახდის დრო აქვს 24 საათი' : 'Buyer has 24 hours to complete payment'}
            </p>
          </div>
        )}

        {/* Declined status */}
        {offer?.status === 'declined' && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-medium">
              <X className="h-5 w-5" />
              {language === 'ka' ? 'შეთავაზება უარყოფილია' : 'Offer Declined'}
            </div>
          </div>
        )}

        {/* Expired status */}
        {(offer?.status === 'expired' || (offer?.status === 'pending' && isExpired)) && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground font-medium">
              <Clock className="h-5 w-5" />
              {language === 'ka' ? 'შეთავაზება ვადაგასულია' : 'Offer Expired'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
