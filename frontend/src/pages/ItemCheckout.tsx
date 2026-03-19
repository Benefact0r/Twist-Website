import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  CreditCard, 
  MapPin, 
  Shield, 
  Lock,
  Check,
  ShoppingBag,
  Info
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { EmailVerificationBanner } from '@/components/auth/EmailVerificationBanner';
import { useToast } from '@/hooks/use-toast';
import { request } from '@/lib/apiClient';

type Step = 'shipping' | 'payment' | 'review';

// Buyer Protection Fee: (Item Price * 0.05) + 0.50 GEL
const calculateBuyerProtectionFee = (itemPrice: number): number => {
  return Math.round((itemPrice * 0.05 + 0.5) * 100) / 100;
};

export default function ItemCheckout() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, profile, isEmailVerified } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [item, setItem] = useState<{
    id: string;
    sellerId: string;
    title: string;
    price: number;
    images: string[];
  } | null>(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: profile?.full_name || '',
    phone: profile?.phone || '',
    street: profile?.address || '',
    city: profile?.city || '',
    region: '',
    postalCode: profile?.postal_code || '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  useEffect(() => {
    const fetchListing = async () => {
      if (!itemId) return;
      try {
        const data = await request<{ listing: { id: string; seller_id: string; title: string; price: number; images: string[] } }>(
          `/listings/${itemId}`,
          { auth: false }
        );
        setItem({
          id: data.listing.id,
          sellerId: data.listing.seller_id,
          title: data.listing.title,
          price: data.listing.price,
          images: data.listing.images || [],
        });
      } catch {
        setItem(null);
      } finally {
        setIsLoadingItem(false);
      }
    };
    fetchListing();
  }, [itemId]);

  // Auth guard
  if (!user) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {language === 'ka' ? 'შესვლა საჭიროა' : 'Login Required'}
            </h1>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              {language === 'ka' 
                ? 'შეკვეთის გასაფორმებლად გთხოვთ შეხვიდეთ ანგარიშში' 
                : 'Please login to complete your purchase'}
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">
                {language === 'ka' ? 'შესვლა' : 'Login'}
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Email verification guard
  if (!isEmailVerified) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto">
            <EmailVerificationBanner />
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoadingItem) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

  // Item not found guard
  if (!item) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-xl md:text-2xl font-bold mb-2">
              {language === 'ka' ? 'ნივთი ვერ მოიძებნა' : 'Item Not Found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === 'ka' 
                ? 'ეს ნივთი აღარ არის ხელმისაწვდომი' 
                : 'This item is no longer available'}
            </p>
            <Button variant="outline" asChild>
              <Link to="/search">
                {language === 'ka' ? 'დაათვალიერე სხვა ნივთები' : 'Browse other items'}
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const deliveryCost = 5;
  const buyerProtectionFee = calculateBuyerProtectionFee(item.price);
  const total = item.price + deliveryCost + buyerProtectionFee;

  const handlePlaceOrder = async () => {
    if (!user || !item) return;
    
    setIsProcessing(true);
    
    try {
      const { order } = await request<{ order: { id: string } }>('/orders', {
        method: 'POST',
        body: {
          buyer_id: user.id,
          seller_id: item.sellerId,
          item_id: item.id,
          item_title: item.title,
          item_image: item.images[0] || null,
          item_price: item.price,
          delivery_cost: deliveryCost,
          buyer_protection_fee: buyerProtectionFee,
          total_amount: total,
          status: 'paid',
          shipping_full_name: shippingInfo.fullName,
          shipping_phone: shippingInfo.phone,
          shipping_street: shippingInfo.street,
          shipping_city: shippingInfo.city,
          shipping_region: shippingInfo.region,
          shipping_postal_code: shippingInfo.postalCode,
          payment_card_last4: paymentInfo.cardNumber.slice(-4),
          paid_at: new Date().toISOString(),
        },
      });

      toast({
        title: language === 'ka' ? '✓ შეკვეთა წარმატებით გაფორმდა!' : '✓ Order placed successfully!',
        description: language === 'ka' 
          ? `თქვენი შეკვეთა #${order.id.slice(0, 8)} მიღებულია` 
          : `Your order #${order.id.slice(0, 8)} has been received`,
      });

      // Navigate to success/orders page
      navigate('/profile?tab=orders');
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: language === 'ka' ? 'შეცდომა' : 'Error',
        description: language === 'ka' 
          ? 'შეკვეთის გაფორმება ვერ მოხერხდა' 
          : 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 'shipping', label: language === 'ka' ? 'მიტანა' : 'Shipping', icon: MapPin },
    { id: 'payment', label: language === 'ka' ? 'გადახდა' : 'Payment', icon: CreditCard },
    { id: 'review', label: language === 'ka' ? 'დადასტურება' : 'Review', icon: Check },
  ];

  return (
    <Layout hideFooter>
      <div className="container py-6 max-w-4xl">
        <Link
          to={`/listing/${itemId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          {language === 'ka' ? 'უკან ნივთზე' : 'Back to item'}
        </Link>

        {/* Single item purchase notice */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm mb-6">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span>
            {language === 'ka' 
              ? 'თქვენ ყიდულობთ ერთ ნივთს. თითოეული ნივთი იყიდება ცალკე.' 
              : 'You are purchasing one item. Each item is bought separately.'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  step === s.id
                    ? "bg-primary text-primary-foreground"
                    : steps.findIndex((x) => x.id === step) > index
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <s.icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-border mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 'shipping' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold mb-6">{language === 'ka' ? 'მიტანის მისამართი' : 'Shipping Address'}</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{language === 'ka' ? 'სახელი და გვარი' : 'Full Name'}</label>
                    <Input value={shippingInfo.fullName} onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{language === 'ka' ? 'ტელეფონი' : 'Phone'}</label>
                    <Input value={shippingInfo.phone} onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} placeholder="+995 XXX XXX XXX" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{language === 'ka' ? 'მისამართი' : 'Street Address'}</label>
                    <Input value={shippingInfo.street} onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{language === 'ka' ? 'ქალაქი' : 'City'}</label>
                      <Input value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{language === 'ka' ? 'რეგიონი' : 'Region'}</label>
                      <Input value={shippingInfo.region} onChange={(e) => setShippingInfo({ ...shippingInfo, region: e.target.value })} required />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-2">{language === 'ka' ? 'საფოსტო კოდი' : 'Postal Code'}</label>
                    <Input value={shippingInfo.postalCode} onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })} placeholder="0000" />
                  </div>
                </form>
                <Button size="lg" className="w-full mt-6" onClick={() => setStep('payment')}>
                  {language === 'ka' ? 'გადახდაზე გადასვლა' : 'Continue to Payment'}
                </Button>
              </div>
            )}

            {step === 'payment' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold mb-6">{language === 'ka' ? 'გადახდის მეთოდი' : 'Payment Method'}</h2>
                <div className="p-4 rounded-xl border border-primary bg-primary/5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{language === 'ka' ? 'საკრედიტო ბარათი' : 'Credit Card'}</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{language === 'ka' ? 'ბარათის ნომერი' : 'Card Number'}</label>
                    <Input value={paymentInfo.cardNumber} onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })} placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{language === 'ka' ? 'ვადა' : 'Expiry'}</label>
                      <Input value={paymentInfo.expiryDate} onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })} placeholder="MM/YY" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <Input type="password" value={paymentInfo.cvv} onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })} placeholder="123" maxLength={4} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{language === 'ka' ? 'სახელი ბარათზე' : 'Name on Card'}</label>
                    <Input value={paymentInfo.cardName} onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })} required />
                  </div>
                </form>
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>{language === 'ka' ? 'უსაფრთხო გადახდა' : 'Secure payment'}</span>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep('shipping')}>{language === 'ka' ? 'უკან' : 'Back'}</Button>
                  <Button size="lg" className="flex-1" onClick={() => setStep('review')}>{language === 'ka' ? 'გადახედვა' : 'Review Order'}</Button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold mb-6">{language === 'ka' ? 'შეკვეთის გადახედვა' : 'Review Your Order'}</h2>
                <div className="p-4 rounded-xl bg-muted/50 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{language === 'ka' ? 'მიტანის მისამართი' : 'Shipping Address'}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep('shipping')}>{language === 'ka' ? 'შეცვლა' : 'Edit'}</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {shippingInfo.fullName}<br />
                    {shippingInfo.street}<br />
                    {shippingInfo.city}, {shippingInfo.region}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{language === 'ka' ? 'გადახდის მეთოდი' : 'Payment Method'}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setStep('payment')}>{language === 'ka' ? 'შეცვლა' : 'Edit'}</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">•••• •••• •••• {paymentInfo.cardNumber.slice(-4) || '0000'}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <h3 className="font-medium mb-3">{language === 'ka' ? 'ნივთი' : 'Item'}</h3>
                  <div className="flex gap-3">
                    <img src={item.images[0]} alt="" className="w-16 h-20 object-cover rounded-lg" />
                    <div>
                      <p className="font-medium line-clamp-1">{item.title}</p>
                      <p className="font-semibold text-price mt-1">₾{item.price}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep('payment')}>{language === 'ka' ? 'უკან' : 'Back'}</Button>
                  <Button size="lg" className="flex-1" onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? (
                      <span className="animate-pulse">{language === 'ka' ? 'დამუშავება...' : 'Processing...'}</span>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        {language === 'ka' ? 'შეკვეთის გაფორმება' : 'Place Order'} • ₾{total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-4">{language === 'ka' ? 'შეკვეთის შეჯამება' : 'Order Summary'}</h3>
              <div className="space-y-3 mb-4 pb-4 border-b border-border">
                <div className="flex gap-3">
                  <img src={item.images[0]} alt="" className="w-14 h-18 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                    <p className="text-sm text-price font-semibold">₾{item.price}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ka' ? 'ნივთის ფასი' : 'Item price'}</span>
                  <span>₾{item.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ka' ? 'მიტანა' : 'Delivery'}</span>
                  <span>₾{deliveryCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ka' ? 'მყიდველის დაცვა' : 'Buyer protection'}</span>
                  <span>₾{buyerProtectionFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-border flex justify-between font-semibold">
                  <span>{language === 'ka' ? 'ჯამი' : 'Total'}</span>
                  <span className="text-lg text-price">₾{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-success-light flex items-center gap-2">
                <Shield className="h-5 w-5 text-success" />
                <p className="text-sm">
                  <span className="font-medium">{language === 'ka' ? 'მყიდველის დაცვა' : 'Buyer Protection'}</span>{' '}
                  <span className="text-muted-foreground">{language === 'ka' ? '• თანხა დაგიბრუნდებათ თუ ნივთი არ მიიღეთ' : '• Get your money back if item not received'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
