import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Camera, ShoppingCart, CreditCard, Truck, CheckCircle, Banknote } from 'lucide-react';
import { PageBreadcrumb } from '@/components/seo/PageBreadcrumb';
import { StaticPageSitemap } from '@/components/seo/StaticPageSitemap';

export default function HowItWorks() {
  const { language } = useLanguage();

  const steps = [
    {
      icon: Camera,
      number: '1',
      title: language === 'ka' ? 'გამყიდველი ატვირთავს ნივთს' : 'Seller uploads item',
      description: language === 'ka'
        ? 'გადაიღე ფოტო, დაწერე მოკლე აღწერა და მიუთითე ფასი. განცხადების ატვირთვა უფასოა.'
        : 'Take a photo, write a short description and set the price. Listing is free.'
    },
    {
      icon: ShoppingCart,
      number: '2',
      title: language === 'ka' ? 'მყიდველი ყიდულობს' : 'Buyer purchases',
      description: language === 'ka'
        ? 'მყიდველი აჭერს "ყიდვა" ღილაკს და ავსებს მიტანის მისამართს.'
        : 'Buyer clicks "Buy" button and fills in the delivery address.'
    },
    {
      icon: CreditCard,
      number: '3',
      title: language === 'ka' ? 'გადახდა დაცულია' : 'Payment is secured',
      description: language === 'ka'
        ? 'თანხა უსაფრთხოდ ინახება სანამ მყიდველი არ მიიღებს ნივთს.'
        : 'Money is held securely until the buyer receives the item.'
    },
    {
      icon: Truck,
      number: '4',
      title: language === 'ka' ? 'კარიდან კარამდე მიწოდება' : 'Door-to-door delivery',
      description: language === 'ka'
        ? 'კურიერი იღებს ნივთს გამყიდველისგან და მიაქვს მყიდველთან პირდაპირ კართან.'
        : 'Courier picks up the item from the seller and delivers it directly to the buyer.'
    },
    {
      icon: CheckCircle,
      number: '5',
      title: language === 'ka' ? 'მყიდველი ადასტურებს' : 'Buyer confirms',
      description: language === 'ka'
        ? 'მყიდველი ამოწმებს ნივთს და ადასტურებს რომ ყველაფერი წესრიგშია.'
        : 'Buyer checks the item and confirms everything is okay.'
    },
    {
      icon: Banknote,
      number: '6',
      title: language === 'ka' ? 'გამყიდველი იღებს თანხას' : 'Seller gets paid',
      description: language === 'ka'
        ? 'დადასტურების შემდეგ თანხა ავტომატურად ირიცხება გამყიდველის ანგარიშზე.'
        : 'After confirmation, money is automatically transferred to the seller\'s account.'
    }
  ];

  const breadcrumbItems = [
    { label: 'How It Works', labelKa: 'როგორ მუშაობს' }
  ];

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <PageBreadcrumb items={breadcrumbItems} className="mb-6" />
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {language === 'ka' ? 'როგორ მუშაობს Twist' : 'How Twist Works'}
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          {language === 'ka'
            ? 'მარტივი პროცესი ნივთების ყიდვა-გაყიდვისთვის 6 ნაბიჯში.'
            : 'Simple process for buying and selling items in 6 steps.'}
        </p>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 md:gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <div className="pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <step.icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                </div>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {language === 'ka' ? 'მნიშვნელოვანი' : 'Important'}
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              {language === 'ka'
                ? 'თანხა გამყიდველს ერიცხება მხოლოდ მას შემდეგ, რაც მყიდველი დაადასტურებს ნივთის მიღებას'
                : 'Seller receives money only after buyer confirms receipt'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              {language === 'ka'
                ? 'პრობლემის შემთხვევაში დაგვიკავშირდით და დაგეხმარებით'
                : 'Contact us in case of any problems and we will help'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              {language === 'ka'
                ? 'მიწოდება ხდება მთელი საქართველოს მასშტაბით'
                : 'Delivery available across all of Georgia'}
            </li>
          </ul>
        </div>
      </div>
      
      <StaticPageSitemap pageType="how-it-works" />
    </Layout>
  );
}
