import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Camera, Tag, MessageSquare, Truck, Banknote, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Selling() {
  const { language } = useLanguage();

  const benefits = [
    {
      icon: CheckCircle,
      title: language === 'ka' ? 'უფასო ატვირთვა' : 'Free listing',
      description: language === 'ka'
        ? 'განცხადების ატვირთვა სრულიად უფასოა.'
        : 'Listing items is completely free.'
    },
    {
      icon: Tag,
      title: language === 'ka' ? 'შენ ადგენ ფასს' : 'You set the price',
      description: language === 'ka'
        ? 'თავად განსაზღვრავ რა ფასად გინდა გაყიდო.'
        : 'You decide what price you want to sell at.'
    },
    {
      icon: Banknote,
      title: language === 'ka' ? 'არანაირი საკომისიო' : 'No commission',
      description: language === 'ka'
        ? 'გამყიდველი არ იხდის საკომისიოს — რაც დაადგინე, იმას მიიღებ.'
        : 'Sellers pay no commission — you get what you set.'
    },
    {
      icon: Truck,
      title: language === 'ka' ? 'კურიერი მოვა შენთან' : 'Courier comes to you',
      description: language === 'ka'
        ? 'ნივთს კურიერი წაიღებს შენი სახლიდან.'
        : 'Courier picks up the item from your home.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: language === 'ka' ? 'გადაიღე ფოტო' : 'Take photos',
      description: language === 'ka'
        ? 'რაც უფრო კარგი ფოტო, მით უფრო სწრაფად გაიყიდება.'
        : 'Better photos mean faster sales.'
    },
    {
      number: '2',
      title: language === 'ka' ? 'დაწერე აღწერა' : 'Write description',
      description: language === 'ka'
        ? 'მოკლე აღწერა ნივთის მდგომარეობის შესახებ.'
        : 'Short description about the item condition.'
    },
    {
      number: '3',
      title: language === 'ka' ? 'მიუთითე ფასი' : 'Set price',
      description: language === 'ka'
        ? 'თავად განსაზღვრავ ფასს.'
        : 'You decide the price.'
    },
    {
      number: '4',
      title: language === 'ka' ? 'დაელოდე მყიდველს' : 'Wait for buyer',
      description: language === 'ka'
        ? 'როცა ვინმე იყიდის, მიიღებ შეტყობინებას.'
        : 'When someone buys, you get notified.'
    },
    {
      number: '5',
      title: language === 'ka' ? 'გადაეცი კურიერს' : 'Hand to courier',
      description: language === 'ka'
        ? 'კურიერი მოვა და წაიღებს ნივთს.'
        : 'Courier comes and picks up the item.'
    },
    {
      number: '6',
      title: language === 'ka' ? 'მიიღე თანხა' : 'Get paid',
      description: language === 'ka'
        ? 'მყიდველის დადასტურების შემდეგ თანხა ირიცხება შენს ანგარიშზე.'
        : 'After buyer confirms, money is transferred to your account.'
    }
  ];

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {language === 'ka' ? 'გაყიდვა' : 'Selling'}
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          {language === 'ka'
            ? 'გაყიდე ნივთები მარტივად და მიიღე თანხა სწრაფად.'
            : 'Sell items easily and get paid quickly.'}
        </p>

        <h2 className="text-2xl font-semibold text-foreground mb-6">
          {language === 'ka' ? 'რატომ გაყიდო Twist-ზე?' : 'Why sell on Twist?'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <benefit.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-6">
          {language === 'ka' ? 'როგორ მუშაობს' : 'How it works'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {steps.map((step, index) => (
            <div key={index} className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mx-auto mb-3">
                {step.number}
              </div>
              <h3 className="font-medium text-foreground mb-1 text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {language === 'ka' ? 'გამჭვირვალე პროცესი' : 'Transparent process'}
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              {language === 'ka'
                ? 'ხედავ შეკვეთის სტატუსს რეალურ დროში'
                : 'See order status in real-time'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              {language === 'ka'
                ? 'იცი როდის მიიღებ თანხას'
                : 'Know when you\'ll get paid'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              {language === 'ka'
                ? 'შეგიძლია დაუკავშირდე მყიდველს ჩატით'
                : 'Can contact buyer via chat'}
            </li>
          </ul>
        </div>

        <div className="text-center">
          <Link to="/sell">
            <Button size="lg" className="gap-2">
              <Camera className="h-4 w-4" />
              {language === 'ka' ? 'დაიწყე გაყიდვა' : 'Start Selling'}
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
