import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, RefreshCw, CreditCard, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOffers, Offer } from '@/hooks/useOffers';
import { formatDistanceToNow } from 'date-fns';
import { ka, enUS } from 'date-fns/locale';

interface OfferCardProps {
  offer: Offer;
  listingTitle?: string;
  listingImage?: string;
  onUpdate?: () => void;
}

export function OfferCard({ offer, listingTitle, listingImage, onUpdate }: OfferCardProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateOfferStatus, isLoading } = useOffers();
  
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');
  
  const isSeller = user?.id === offer.seller_id;
  const isBuyer = user?.id === offer.buyer_id;
  
  const isExpired = new Date(offer.expires_at) < new Date();
  const expiresIn = formatDistanceToNow(new Date(offer.expires_at), {
    addSuffix: true,
    locale: language === 'ka' ? ka : enUS
  });

  const handleAccept = async () => {
    const success = await updateOfferStatus(offer.id, 'accepted');
    if (success) {
      onUpdate?.();
    }
  };

  const handleDecline = async () => {
    const success = await updateOfferStatus(offer.id, 'declined');
    if (success) {
      onUpdate?.();
    }
  };

  const handleCounter = async () => {
    const amount = parseFloat(counterAmount);
    if (amount <= 0 || amount > offer.original_price) return;
    
    const success = await updateOfferStatus(offer.id, 'declined', amount);
    if (success) {
      setShowCounterInput(false);
      setCounterAmount('');
      onUpdate?.();
    }
  };

  const handlePayNow = () => {
    navigate(`/checkout/offer/${offer.id}`);
  };

  const getStatusBadge = () => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: language === 'ka' ? 'მოლოდინში' : 'Pending', variant: 'secondary' },
      accepted: { label: language === 'ka' ? 'მიღებული' : 'Accepted', variant: 'default' },
      declined: { label: language === 'ka' ? 'უარყოფილი' : 'Declined', variant: 'destructive' },
      expired: { label: language === 'ka' ? 'ვადაგასული' : 'Expired', variant: 'outline' },
      countered: { label: language === 'ka' ? 'კონტრშეთავაზება' : 'Countered', variant: 'secondary' },
      cancelled: { label: language === 'ka' ? 'გაუქმებული' : 'Cancelled', variant: 'outline' },
    };
    
    const status = isExpired && offer.status === 'pending' ? 'expired' : offer.status;
    const config = statusConfig[status] || statusConfig.pending;
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const discount = Math.round((1 - offer.offered_amount / offer.original_price) * 100);

  return (
    <div className={cn(
      "rounded-xl border p-4 transition-all",
      offer.status === 'accepted' ? "border-success bg-success/5" :
      offer.status === 'declined' ? "border-destructive/30 bg-destructive/5" :
      offer.status === 'countered' ? "border-primary bg-primary/5" :
      "border-border bg-card"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {listingImage && (
            <img src={listingImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
          )}
          <div>
            {listingTitle && (
              <p className="text-sm font-medium line-clamp-1">{listingTitle}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {isSeller 
                ? (language === 'ka' ? 'მყიდველის შეთავაზება' : 'Buyer offer')
                : (language === 'ka' ? 'თქვენი შეთავაზება' : 'Your offer')
              }
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Offer Amount */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-2xl font-bold">₾{offer.offered_amount}</p>
          <p className="text-sm text-muted-foreground">
            {language === 'ka' ? 'ორიგინალი' : 'Original'}: ₾{offer.original_price}
            <span className="ml-2 text-primary font-medium">-{discount}%</span>
          </p>
        </div>
        
        {offer.counter_offer && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">
              {language === 'ka' ? 'კონტრშეთავაზება' : 'Counter offer'}
            </p>
            <p className="text-xl font-bold text-primary">₾{offer.counter_offer}</p>
          </div>
        )}
      </div>

      {/* Message */}
      {offer.message && (
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 mb-3">
          "{offer.message}"
        </p>
      )}

      {/* Expiry */}
      {offer.status === 'pending' && !isExpired && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Clock className="h-3.5 w-3.5" />
          <span>{language === 'ka' ? 'იწურება' : 'Expires'} {expiresIn}</span>
        </div>
      )}

      {/* Actions */}
      {offer.status === 'pending' && !isExpired && (
        <div className="space-y-2">
          {isSeller && (
            <>
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
                        placeholder={`${offer.offered_amount + 1} - ${offer.original_price}`}
                        className="pl-7"
                        min={offer.offered_amount + 1}
                        max={offer.original_price}
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
                    {language === 'ka' ? 'შემოთავაზეთ ფასი' : 'Suggest a price'} (₾{offer.offered_amount + 1} - ₾{offer.original_price})
                  </p>
                </div>
              )}
            </>
          )}
          
          {isBuyer && (
            <p className="text-sm text-center text-muted-foreground py-2">
              {language === 'ka' ? '⏳ გამყიდველის პასუხს ველოდებით...' : '⏳ Waiting for seller response...'}
            </p>
          )}
        </div>
      )}

      {/* Countered - Buyer actions */}
      {offer.status === 'countered' && isBuyer && offer.counter_offer && (
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
      {offer.status === 'accepted' && isBuyer && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-success font-medium">
            <Check className="h-5 w-5" />
            {language === 'ka' ? 'შეთავაზება მიღებულია!' : 'Offer Accepted!'}
          </div>
          <Button onClick={handlePayNow} className="w-full" size="lg">
            <CreditCard className="h-4 w-4 mr-2" />
            {language === 'ka' ? 'გადახდა' : 'Pay Now'} • ₾{offer.counter_offer || offer.offered_amount}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {language === 'ka' ? '⏰ გადახდა 24 საათში' : '⏰ Complete payment within 24 hours'}
          </p>
        </div>
      )}

      {/* Accepted - Seller view */}
      {offer.status === 'accepted' && isSeller && (
        <div className="text-center py-2">
          <div className="flex items-center justify-center gap-2 text-success font-medium">
            <Check className="h-5 w-5" />
            {language === 'ka' ? 'თქვენ მიიღეთ შეთავაზება' : 'You accepted this offer'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ka' ? 'მყიდველს გადახდის დრო აქვს 24 საათი' : 'Buyer has 24 hours to complete payment'}
          </p>
        </div>
      )}
    </div>
  );
}
