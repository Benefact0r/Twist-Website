import { useState } from 'react';
import { X, Shield, Truck, Check, Phone, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { request } from '@/lib/apiClient';
import { Listing } from '@/types';
import { useNavigate } from 'react-router-dom';

interface BuyNowModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

const DELIVERY_COST = 10;

const calculateBuyerProtectionFee = (price: number) => {
  return Math.round((price * 0.05 + 0.5) * 100) / 100;
};

export function BuyNowModal({ listing, isOpen, onClose }: BuyNowModalProps) {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const buyerProtectionFee = calculateBuyerProtectionFee(listing.price);
  const totalPrice = listing.price + DELIVERY_COST + buyerProtectionFee;

  const handleConfirmReservation = async () => {
    if (!user) {
      navigate('/auth', { state: { from: `/listing/${listing.id}` } });
      return;
    }

    if (user.id === listing.sellerId) {
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' ? 'თქვენ ვერ იყიდით საკუთარ ნივთს' : "You can't buy your own item",
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      const shippingFullName =
        profile?.full_name || profile?.username || user.email || 'Twist Customer';
      const shippingPhone = profile?.phone || 'N/A';
      const shippingStreet = profile?.address || 'To be confirmed by support';
      const shippingCity = profile?.city || profile?.location || 'Tbilisi';

      await request('/orders', {
        method: 'POST',
        body: {
          buyer_id: user.id,
          seller_id: listing.sellerId,
          item_id: listing.id,
          item_title: listing.title,
          item_image: listing.images[0]?.url || null,
          item_price: listing.price,
          delivery_cost: DELIVERY_COST,
          buyer_protection_fee: buyerProtectionFee,
          total_amount: totalPrice,
          status: 'pending_payment',
          shipping_full_name: shippingFullName,
          shipping_phone: shippingPhone,
          shipping_street: shippingStreet,
          shipping_city: shippingCity,
          shipping_region: '',
          shipping_postal_code: profile?.postal_code || '',
        },
      });

      toast({
        title: language === 'ka' ? '✅ ნივთი დაჯავშნულია!' : '✅ Item reserved!',
        description: language === 'ka' 
          ? 'Twist დაგიკავშირდებათ 24 საათის განმავლობაში' 
          : 'Twist will contact you within 24 hours',
      });

      onClose();
      navigate('/profile?tab=orders');
      
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' 
          ? 'დაჯავშნა ვერ მოხერხდა. სცადეთ თავიდან.' 
          : 'Failed to reserve item. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-card rounded-2xl shadow-2xl z-50 animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold">
                {language === 'ka' ? '🔒 უსაფრთხო ბეტა ყიდვა' : '🔒 Secure Beta Purchase'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {language === 'ka' ? 'Twist კოორდინაციას უწევს თქვენს უსაფრთხოებას' : 'Twist coordinates everything for your safety'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* How it works */}
          <div className="bg-muted/50 rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">
              {language === 'ka' ? '📋 როგორ მუშაობს ბეტაში:' : '📋 How it works during beta:'}
            </h3>
            <div className="space-y-2.5">
              {[
                {
                  icon: Check,
                  ka: 'ნივთი დაჯავშნულია - სხვას ვეღარ იყიდის',
                  en: 'Item reserved - No one else can buy'
                },
                {
                  icon: Phone,
                  ka: 'Twist დაგიკავშირდებათ 24 საათში',
                  en: 'Twist contacts you within 24 hours'
                },
                {
                  icon: Banknote,
                  ka: 'ვაწყობთ გადახდას (ნაღდი ან გადარიცხვა)',
                  en: 'We arrange payment (cash or bank transfer)'
                },
                {
                  icon: Truck,
                  ka: 'კარიდან კარამდე მიტანას ვაწყობთ',
                  en: 'We handle door-to-door delivery'
                },
                {
                  icon: Shield,
                  ka: 'თქვენ იღებთ ნივთს → ადასტურებთ → გამყიდველი იღებს თანხას',
                  en: 'You receive item → Confirm → Seller gets paid'
                }
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                    <step.icon className="h-3 w-3 text-success" />
                  </div>
                  <span className="text-sm">
                    {language === 'ka' ? step.ka : step.en}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Item preview */}
          <div className="flex gap-3 p-3 bg-muted/30 rounded-xl">
            <img 
              src={listing.images[0]?.thumbnailUrl || listing.images[0]?.url} 
              alt="" 
              className="w-16 h-20 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium line-clamp-2">{listing.title}</p>
              <p className="text-lg font-bold text-price mt-1">₾{listing.price}</p>
              <p className="text-xs text-muted-foreground">
                {listing.seller?.displayName || 'Seller'} • {listing.seller?.bio || 'თბილისი'}
              </p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{language === 'ka' ? 'ნივთი' : 'Item'}</span>
              <span>₾{listing.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{language === 'ka' ? 'მიტანა' : 'Delivery'}</span>
              <span>₾{DELIVERY_COST}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{language === 'ka' ? 'მყიდველის დაცვა' : 'Buyer Protection'}</span>
              <span>₾{buyerProtectionFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t">
              <span>{language === 'ka' ? 'სულ' : 'Total'}</span>
              <span className="text-price">₾{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Beta notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>🔒 {language === 'ka' ? 'ბეტა' : 'Beta'}:</strong>{' '}
              {language === 'ka' 
                ? 'ეს არის ჩვენი დახურული ბეტა. ყველა ტრანზაქცია ხელით მართულია Twist გუნდის მიერ მაქსიმალური უსაფრთხოებისთვის. ავტომატური გადახდები მალე!'
                : 'This is our closed beta. All transactions are manually managed by Twist team for maximum safety. Automated payments coming soon!'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            {language === 'ka' ? 'გაუქმება' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleConfirmReservation}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <span className="animate-pulse">
                {language === 'ka' ? 'დამუშავება...' : 'Processing...'}
              </span>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {language === 'ka' ? 'დაჯავშნა' : 'Reserve Item'}
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
