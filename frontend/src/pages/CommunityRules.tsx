import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Heart, Shield, MessageSquare, Scale, AlertCircle } from 'lucide-react';

const CommunityRules = () => {
  const { language } = useLanguage();

  const rules = [
    {
      icon: Heart,
      title: language === 'ka' ? 'პატივისცემით მოპყრობა' : 'Treat Others with Respect',
      description: language === 'ka'
        ? 'მოექეცით ყველა მომხმარებელს პატივისცემით. თავაზიანი კომუნიკაცია ჩვენი საზოგადოების საფუძველია.'
        : 'Treat all users with respect. Polite communication is the foundation of our community.'
    },
    {
      icon: Shield,
      title: language === 'ka' ? 'პატიოსანი განცხადებები' : 'Honest Listings',
      description: language === 'ka'
        ? 'გამოაქვეყნეთ ზუსტი აღწერები და რეალური ფოტოები. ნივთის მდგომარეობა გულახდილად მიუთითეთ.'
        : 'Post accurate descriptions and real photos. Be honest about the item condition.'
    },
    {
      icon: MessageSquare,
      title: language === 'ka' ? 'შეურაცხყოფის აკრძალვა' : 'No Harassment',
      description: language === 'ka'
        ? 'შეურაცხყოფა, მუქარა ან დამცირება აკრძალულია. დაუშვებელია სიძულვილის ენის გამოყენება.'
        : 'Harassment, threats, or abuse are prohibited. Hate speech is not allowed.'
    },
    {
      icon: Scale,
      title: language === 'ka' ? 'სამართლიანი ვაჭრობა' : 'Fair Trading',
      description: language === 'ka'
        ? 'თაღლითობა და მოტყუება აკრძალულია. არ ეცადოთ გამყიდველის ან მყიდველის მოტყუებას.'
        : 'Fraud and deception are prohibited. Do not attempt to deceive sellers or buyers.'
    },
    {
      icon: AlertCircle,
      title: language === 'ka' ? 'კანონის დაცვა' : 'Follow the Law',
      description: language === 'ka'
        ? 'დაიცავით საქართველოს კანონმდებლობა. არ გაყიდოთ უკანონო ნივთები.'
        : 'Comply with Georgian laws. Do not sell illegal items.'
    },
  ];

  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ka' ? 'საზოგადოების წესები' : 'Community Rules'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ka' 
              ? 'Twist-ის საზოგადოება დაფუძნებულია ნდობაზე და პატივისცემაზე. ეს წესები გვეხმარება უსაფრთხო გარემოს შექმნაში.'
              : 'The Twist community is built on trust and respect. These rules help us create a safe environment.'}
          </p>
        </div>

        {/* Rules */}
        <div className="space-y-6 mb-12">
          {rules.map((rule, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <rule.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{rule.title}</h3>
                  <p className="text-muted-foreground">{rule.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enforcement notice */}
        <div className="bg-muted/30 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
            {language === 'ka' ? 'საზოგადოების დაცვა' : 'Protecting Our Community'}
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            {language === 'ka'
              ? 'Twist იტოვებს უფლებას გაატაროს ზომები საზოგადოების დასაცავად. ეს შეიძლება მოიცავდეს განცხადებების წაშლას, ანგარიშების შეზღუდვას ან სხვა ქმედებებს საჭიროების შემთხვევაში.'
              : 'Twist reserves the right to take action to protect the community. This may include removing listings, restricting accounts, or other measures as necessary.'}
          </p>
        </div>

        {/* Report section */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-3">
            {language === 'ka'
              ? 'ხედავთ წესების დარღვევას? შეგვატყობინეთ.'
              : 'See a rule violation? Let us know.'}
          </p>
          <a href="/contact" className="text-primary hover:underline font-medium">
            {language === 'ka' ? 'დარღვევის დაფიქსირება →' : 'Report a violation →'}
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityRules;
