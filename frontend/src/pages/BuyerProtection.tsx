import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Clock, CheckCircle, MessageSquare, HeadphonesIcon } from 'lucide-react';

const BuyerProtection = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: language === 'ka' ? 'დაცული გადახდები' : 'Protected Payments',
      description: language === 'ka' 
        ? 'თქვენი გადახდა დაცულია მანამ, სანამ ნივთს არ მიიღებთ. გამყიდველი თანხას იღებს მხოლოდ მიწოდების დასრულების შემდეგ.'
        : 'Your payment is protected until you receive the item. The seller receives the funds only after delivery is completed.'
    },
    {
      icon: Clock,
      title: language === 'ka' ? 'უსაფრთხო ტრანზაქციები' : 'Secure Transactions',
      description: language === 'ka'
        ? 'Twist ინახავს თანხას მანამ, სანამ ტრანზაქცია წარმატებით არ დასრულდება. ეს გაძლევთ დროს ნივთის შესამოწმებლად.'
        : 'Twist holds the payment until the transaction is successfully completed. This gives you time to inspect the item.'
    },
    {
      icon: MessageSquare,
      title: language === 'ka' ? 'პრობლემის დაფიქსირება' : 'Report Issues',
      description: language === 'ka'
        ? 'თუ მიღებული ნივთი არ შეესაბამება აღწერას ან აქვს პრობლემა, შეგიძლიათ დაფიქსიროთ საჩივარი.'
        : 'If the item you received does not match the description or has issues, you can file a complaint.'
    },
    {
      icon: HeadphonesIcon,
      title: language === 'ka' ? 'დავის განხილვა' : 'Dispute Resolution',
      description: language === 'ka'
        ? 'Twist-ის გუნდი განიხილავს თქვენს საჩივარს და დაგეხმარებათ სამართლიანი გადაწყვეტილების მიღებაში.'
        : 'The Twist team reviews your complaint and helps you reach a fair resolution.'
    },
  ];

  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ka' ? 'მყიდველის დაცვა' : 'Buyer Protection'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ka' 
              ? 'Twist-ზე ყოველი შესყიდვა დაცულია. ჩვენ ვზრუნავთ თქვენს უსაფრთხოებაზე.'
              : 'Every purchase on Twist is protected. We care about your safety.'}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            {language === 'ka' ? 'როგორ მუშაობს?' : 'How does it work?'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                1
              </div>
              <h4 className="font-medium text-foreground mb-2">
                {language === 'ka' ? 'გადაიხადეთ' : 'Make Payment'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === 'ka' 
                  ? 'გადახდა ხდება უსაფრთხოდ Twist-ის პლატფორმაზე'
                  : 'Payment is made securely on the Twist platform'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                2
              </div>
              <h4 className="font-medium text-foreground mb-2">
                {language === 'ka' ? 'მიიღეთ ნივთი' : 'Receive Item'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === 'ka'
                  ? 'გამყიდველი გაგზავნის ნივთს მითითებულ მისამართზე'
                  : 'Seller ships the item to your address'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                3
              </div>
              <h4 className="font-medium text-foreground mb-2">
                {language === 'ka' ? 'დაადასტურეთ' : 'Confirm'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === 'ka'
                  ? 'დაადასტურეთ მიღება და გამყიდველი მიიღებს თანხას'
                  : 'Confirm receipt and the seller receives payment'}
              </p>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-xl">
          <p className="text-sm text-muted-foreground text-center">
            {language === 'ka'
              ? 'შენიშვნა: მყიდველის დაცვა ვრცელდება პლატფორმის შიგნით განხორციელებულ ტრანზაქციებზე. კითხვების შემთხვევაში დაგვიკავშირდით.'
              : 'Note: Buyer protection applies to transactions made within the platform. Contact us if you have questions.'}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default BuyerProtection;
