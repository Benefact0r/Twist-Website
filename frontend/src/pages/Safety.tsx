import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Lock, MessageSquare, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Safety() {
  const { language } = useLanguage();

  const features = [
    {
      icon: Lock,
      title: language === 'ka' ? 'დაცული გადახდები' : 'Secure Payments',
      description: language === 'ka'
        ? 'თანხა უსაფრთხოდ ინახება სანამ მყიდველი არ მიიღებს და დაადასტურებს ნივთს. გამყიდველს თანხა ერიცხება მხოლოდ დადასტურების შემდეგ.'
        : 'Money is held securely until buyer receives and confirms the item. Seller gets paid only after confirmation.'
    },
    {
      icon: Shield,
      title: language === 'ka' ? 'მყიდველის დაცვა' : 'Buyer Protection',
      description: language === 'ka'
        ? 'თუ ნივთი არ შეესაბამება აღწერას ან დაზიანებულია, თქვენი ფული დაცულია. დაგვიკავშირდით და დაგეხმარებით.'
        : 'If item doesn\'t match description or is damaged, your money is protected. Contact us and we will help.'
    },
    {
      icon: MessageSquare,
      title: language === 'ka' ? 'უსაფრთხო კომუნიკაცია' : 'Safe Communication',
      description: language === 'ka'
        ? 'მყიდველსა და გამყიდველს შორის კომუნიკაცია ხდება პლატფორმის ჩატის საშუალებით.'
        : 'Communication between buyer and seller happens through the platform chat.'
    },
    {
      icon: Eye,
      title: language === 'ka' ? 'ადმინისტრაციის მონიტორინგი' : 'Admin Moderation',
      description: language === 'ka'
        ? 'ჩვენი გუნდი ამოწმებს განცხადებებს და მომხმარებლებს უსაფრთხო გარემოს შესანარჩუნებლად.'
        : 'Our team reviews listings and users to maintain a safe environment.'
    },
    {
      icon: AlertTriangle,
      title: language === 'ka' ? 'დარღვევების რეპორტი' : 'Report Violations',
      description: language === 'ka'
        ? 'შეგიძლიათ დაარეპორტოთ საეჭვო განცხადებები ან მომხმარებლები. ჩვენ სწრაფად განვიხილავთ ყველა რეპორტს.'
        : 'You can report suspicious listings or users. We quickly review all reports.'
    }
  ];

  const tips = [
    language === 'ka' ? 'არ გადაიხადოთ თანხა პლატფორმის გარეთ' : 'Don\'t pay money outside the platform',
    language === 'ka' ? 'ყურადღებით წაიკითხეთ ნივთის აღწერა' : 'Read item description carefully',
    language === 'ka' ? 'დაათვალიერეთ გამყიდველის პროფილი' : 'Check seller\'s profile',
    language === 'ka' ? 'შეამოწმეთ ნივთი მიღებისთანავე' : 'Check item upon receipt',
    language === 'ka' ? 'პრობლემის შემთხვევაში დაუყოვნებლივ დაგვიკავშირდით' : 'Contact us immediately if there\'s a problem'
  ];

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {language === 'ka' ? 'უსაფრთხოება და ნდობა' : 'Safety & Trust'}
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          {language === 'ka'
            ? 'თქვენი უსაფრთხოება ჩვენი პრიორიტეტია.'
            : 'Your safety is our priority.'}
        </p>

        <div className="space-y-4 mb-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {language === 'ka' ? 'უსაფრთხოების რჩევები' : 'Safety Tips'}
          </h2>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 bg-muted/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            {language === 'ka' ? 'გჭირდებათ დახმარება?' : 'Need help?'}
          </h2>
          <p className="text-muted-foreground mb-4">
            {language === 'ka'
              ? 'თუ რაიმე საეჭვოს შეამჩნევთ ან დახმარება გჭირდებათ, დაგვიკავშირდით:'
              : 'If you notice anything suspicious or need help, contact us:'}
          </p>
          <a 
            href="mailto:Twistingsocials@gmail.com" 
            className="text-primary font-medium hover:underline"
          >
            Twistingsocials@gmail.com
          </a>
        </div>
      </div>
    </Layout>
  );
}
