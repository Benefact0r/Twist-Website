import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, ShoppingCart, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Buying() {
  const { language } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: language === 'ka' ? 'მოძებნე ნივთი' : 'Find an item',
      description: language === 'ka'
        ? 'გამოიყენე ძიება ან დაათვალიერე კატეგორიები სასურველი ნივთის მოსაძებნად.'
        : 'Use search or browse categories to find what you\'re looking for.'
    },
    {
      icon: ShoppingCart,
      title: language === 'ka' ? 'დააჭირე "ყიდვა"' : 'Click "Buy"',
      description: language === 'ka'
        ? 'ყოველი შეკვეთა მოიცავს მხოლოდ ერთ ნივთს. კალათა არ არის — პირდაპირ ყიდულობ.'
        : 'Each order includes only one item. No cart — you buy directly.'
    },
    {
      icon: CreditCard,
      title: language === 'ka' ? 'გადაიხადე უსაფრთხოდ' : 'Pay securely',
      description: language === 'ka'
        ? 'თანხა უსაფრთხოდ ინახება სანამ ნივთს არ მიიღებ და დაადასტურებ.'
        : 'Money is held securely until you receive and confirm the item.'
    },
    {
      icon: Truck,
      title: language === 'ka' ? 'მიიღე კართან' : 'Receive at your door',
      description: language === 'ka'
        ? 'კურიერი მოგიტანს ნივთს პირდაპირ მითითებულ მისამართზე.'
        : 'Courier delivers the item directly to your specified address.'
    },
    {
      icon: CheckCircle,
      title: language === 'ka' ? 'დაადასტურე' : 'Confirm',
      description: language === 'ka'
        ? 'შეამოწმე ნივთი და დაადასტურე რომ ყველაფერი წესრიგშია. მხოლოდ ამის შემდეგ ირიცხება თანხა გამყიდველზე.'
        : 'Check the item and confirm everything is okay. Only then is the money transferred to the seller.'
    }
  ];

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {language === 'ka' ? 'ყიდვა' : 'Buying'}
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          {language === 'ka'
            ? 'როგორ იყიდო ნივთები Twist-ზე მარტივად და უსაფრთხოდ.'
            : 'How to buy items on Twist easily and safely.'}
        </p>

        <div className="space-y-6 mb-10">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start bg-card border border-border rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {language === 'ka' ? 'მნიშვნელოვანი' : 'Important'}
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              {language === 'ka'
                ? 'ყოველი შეკვეთა მოიცავს მხოლოდ ერთ ნივთს'
                : 'Each order includes only one item'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              {language === 'ka'
                ? 'თანხა დაცულია სანამ არ დაადასტურებ ნივთის მიღებას'
                : 'Money is protected until you confirm receipt'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              {language === 'ka'
                ? 'პრობლემის შემთხვევაში დაგვიკავშირდით'
                : 'Contact us in case of any problems'}
            </li>
          </ul>
        </div>

        <div className="text-center">
          <Link to="/search">
            <Button size="lg" className="gap-2">
              <Search className="h-4 w-4" />
              {language === 'ka' ? 'დაიწყე ძიება' : 'Start Browsing'}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
