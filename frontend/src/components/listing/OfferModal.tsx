import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Listing } from '@/types';
import { useOffers } from '@/hooks/useOffers';
import { useConversations } from '@/hooks/useConversations';
import { useDemoSeller } from '@/hooks/useDemoSeller';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface OfferModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export function OfferModal({ listing, isOpen, onClose }: OfferModalProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isEmailVerified } = useAuth();
  const { createOffer, isLoading: offerLoading } = useOffers();
  const { getOrCreateConversation, sendMessage } = useConversations();
  const { getOrCreateDemoSeller } = useDemoSeller();
  
  const [customPrice, setCustomPrice] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const minPrice = Math.ceil(listing.price * 0.5); // 50% minimum
  const discounts = [10, 20, 30];

  const getDiscountedPrice = (discount: number) => {
    return Math.round(listing.price * (1 - discount / 100));
  };

  const getCurrentOfferPrice = (): number => {
    if (selectedDiscount !== null) {
      return getDiscountedPrice(selectedDiscount);
    }
    return customPrice ? parseInt(customPrice) : 0;
  };

  const isValidOffer = (): boolean => {
    const offerPrice = getCurrentOfferPrice();
    return offerPrice >= minPrice && offerPrice <= listing.price && user !== null && isEmailVerified;
  };

  const handleSelectDiscount = (discount: number) => {
    setSelectedDiscount(discount);
    setCustomPrice('');
  };

  const handleCustomPriceChange = (value: string) => {
    setCustomPrice(value);
    setSelectedDiscount(null);
  };

  const handleSendOffer = async () => {
    if (!isValidOffer() || !user) return;

    setIsSending(true);
    const offerPrice = getCurrentOfferPrice();
    
    try {
      // Get or create a real seller profile (handles both real and demo sellers)
      const sellerId = listing.seller?.id || listing.sellerId;
      const realSellerId = await getOrCreateDemoSeller(sellerId);
      
      if (!realSellerId) {
        toast({
          title: language === 'ka' ? "შეცდომა" : "Error",
          description: language === 'ka' ? "გამყიდველის პროფილი ვერ მოიძებნა" : "Seller profile not found",
          variant: "destructive"
        });
        setIsSending(false);
        return;
      }

      // 1. Create the offer in the database
      const offer = await createOffer(
        listing.id,
        realSellerId,
        offerPrice,
        listing.price,
        message || undefined
      );

      if (!offer) {
        setIsSending(false);
        return;
      }

      // 2. Create/get conversation with the real seller ID
      const conversationId = await getOrCreateConversation(realSellerId, listing.id);
      
      if (conversationId) {
        // 3. Send offer message in the conversation with offer_id
        const offerMessageContent = JSON.stringify({
          type: 'offer',
          offerId: offer.id,
          offerAmount: offerPrice,
          originalPrice: listing.price,
          message: message || null
        });
        
        await sendMessage(
          conversationId,
          offerMessageContent,
          'offer',
          offer.id
        );

        toast({
          title: language === 'ka' ? "✓ შეთავაზება გაიგზავნა" : "✓ Offer sent",
          description: language === 'ka' 
            ? `₾${offerPrice} შეთავაზება გაიგზავნა ${listing.seller?.name || listing.seller?.displayName || 'გამყიდველს'}`
            : `₾${offerPrice} offer sent to ${listing.seller?.name || listing.seller?.displayName || 'seller'}`,
        });

        onClose();
        // Navigate to the specific conversation
        navigate(`/messages?chat=${conversationId}`);
      }
    } catch (error) {
      console.error('Error sending offer:', error);
      toast({
        title: language === 'ka' ? "შეცდომა" : "Error",
        description: language === 'ka' ? "შეთავაზების გაგზავნა ვერ მოხერხდა" : "Failed to send offer",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const savings = listing.price - getCurrentOfferPrice();
  const savingsPercent = Math.round((savings / listing.price) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:max-w-md animate-slide-up md:animate-fade-in">
        <div className="bg-card rounded-t-2xl md:rounded-2xl border border-border shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
            <h2 className="text-lg font-semibold">{t('offer.title')}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Login prompt */}
            {!user && (
              <div className="p-4 bg-destructive/10 rounded-xl text-center">
                <p className="text-sm text-destructive">
                  {language === 'ka' 
                    ? 'შეთავაზების გასაკეთებლად გთხოვთ შეხვიდეთ ანგარიშში'
                    : 'Please login to make an offer'}
                </p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/auth')}>
                  {language === 'ka' ? 'შესვლა' : 'Login'}
                </Button>
              </div>
            )}

            {/* Email verification prompt */}
            {user && !isEmailVerified && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {language === 'ka' 
                    ? 'შეთავაზების გასაგზავნად დაადასტურე ელფოსტა'
                    : 'Please verify your email to send offers'}
                </p>
              </div>
            )}

            {/* Listing preview */}
            <div className="flex gap-3 p-3 rounded-xl bg-muted/50">
              <img
                src={listing.images[0]?.thumbnailUrl}
                alt=""
                className="w-16 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium line-clamp-2">{listing.title}</p>
                <p className="text-lg font-bold text-price mt-1">
                  ₾{listing.price}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ka' ? 'გამყიდველი' : 'Seller'}: {listing.seller?.name || listing.seller?.displayName || (language === 'ka' ? 'გამყიდველი' : 'Seller')}
                </p>
              </div>
            </div>

            {/* Quick offers */}
            <div>
              <p className="text-sm font-medium mb-3">{t('offer.quickOffers')}</p>
              <div className="flex gap-2">
                {discounts.map((discount) => {
                  const discountedPrice = getDiscountedPrice(discount);
                  const isDisabled = discountedPrice < minPrice;
                  return (
                    <button
                      key={discount}
                      onClick={() => !isDisabled && handleSelectDiscount(discount)}
                      disabled={isDisabled}
                      className={cn(
                        "flex-1 p-3 rounded-xl border-2 transition-all text-center",
                        selectedDiscount === discount
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <p className="text-lg font-bold">₾{discountedPrice}</p>
                      <p className="text-xs text-muted-foreground">-{discount}%</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('offer.customPrice')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₾
                </span>
                <Input
                  type="number"
                  value={customPrice}
                  onChange={(e) => handleCustomPriceChange(e.target.value)}
                  placeholder={t('offer.enterPrice')}
                  className="pl-8"
                  min={minPrice}
                  max={listing.price}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {t('offer.minPrice', { min: minPrice })}
              </p>
              {customPrice && parseInt(customPrice) < minPrice && (
                <p className="text-xs text-destructive mt-1">
                  {t('offer.tooLow')}
                </p>
              )}
            </div>


            {/* Optional message */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'ka' ? 'შეტყობინება (არასავალდებულო)' : 'Message (optional)'}
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'ka' ? 'მაგ: შეიძლება ფასზე შეთანხმება?' : 'e.g., Would you consider this price?'}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {message.length}/500
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border sticky bottom-0 bg-card">
            <Button
              size="lg"
              className="w-full"
              onClick={handleSendOffer}
              disabled={!isValidOffer() || isSending || offerLoading}
            >
              {isSending || offerLoading ? (
                <span className="animate-pulse">{t('common.loading')}</span>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  {t('offer.send')} • ₾{getCurrentOfferPrice() || '—'}
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              ⏰ {language === 'ka' ? 'შეთავაზება მოქმედია 48 საათის განმავლობაში' : 'Offer valid for 48 hours'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}