import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lock, Database, Eye, Share2, Mail } from 'lucide-react';

const Privacy = () => {
  const { language } = useLanguage();

  const sections = [
    {
      icon: Database,
      title: language === 'ka' ? 'რა მონაცემებს ვაგროვებთ' : 'What Data We Collect',
      items: [
        language === 'ka' ? 'ანგარიშის ინფორმაცია (სახელი, ელფოსტა, ტელეფონი)' : 'Account information (name, email, phone)',
        language === 'ka' ? 'განცხადებების მონაცემები (ფოტოები, აღწერები, ფასები)' : 'Listing data (photos, descriptions, prices)',
        language === 'ka' ? 'შეტყობინებები მომხმარებლებს შორის' : 'Messages between users',
        language === 'ka' ? 'ტრანზაქციების ისტორია' : 'Transaction history',
      ]
    },
    {
      icon: Eye,
      title: language === 'ka' ? 'როგორ ვიყენებთ მონაცემებს' : 'How We Use Data',
      items: [
        language === 'ka' ? 'პლატფორმის ფუნქციონირებისთვის' : 'To operate the platform',
        language === 'ka' ? 'მომხმარებლებს შორის კომუნიკაციის უზრუნველსაყოფად' : 'To enable communication between users',
        language === 'ka' ? 'უსაფრთხოებისა და თაღლითობის პრევენციისთვის' : 'For security and fraud prevention',
        language === 'ka' ? 'მომსახურების გასაუმჯობესებლად' : 'To improve our services',
      ]
    },
    {
      icon: Share2,
      title: language === 'ka' ? 'მონაცემების გაზიარება' : 'Data Sharing',
      items: [
        language === 'ka' ? 'თქვენი მონაცემები არ იყიდება მესამე პირებზე' : 'Your data is not sold to third parties',
        language === 'ka' ? 'საჯარო პროფილის ინფორმაცია ხილულია სხვა მომხმარებლებისთვის' : 'Public profile information is visible to other users',
        language === 'ka' ? 'მონაცემები შეიძლება გაზიარდეს კანონის მოთხოვნით' : 'Data may be shared if required by law',
      ]
    },
  ];

  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ka' ? 'კონფიდენციალურობის პოლიტიკა' : 'Privacy Policy'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ka' 
              ? 'ჩვენ ვზრუნავთ თქვენი პირადი ინფორმაციის დაცვაზე.'
              : 'We care about protecting your personal information.'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'ka' ? 'ბოლო განახლება: იანვარი 2026' : 'Last updated: January 2026'}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Your Rights */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
            {language === 'ka' ? 'თქვენი უფლებები' : 'Your Rights'}
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            {language === 'ka'
              ? 'თქვენ გაქვთ უფლება მოითხოვოთ თქვენი მონაცემების ნახვა, შესწორება ან წაშლა. ასევე შეგიძლიათ გააუქმოთ მარკეტინგული შეტყობინებების მიღება.'
              : 'You have the right to request access to, correction of, or deletion of your data. You can also opt out of marketing communications.'}
          </p>
        </div>

        {/* Contact */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {language === 'ka' ? 'კითხვები კონფიდენციალურობის შესახებ?' : 'Questions about privacy?'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'ka'
                  ? 'თუ გაქვთ კითხვები თქვენი მონაცემების შესახებ, დაგვიკავშირდით.'
                  : 'If you have questions about your data, contact us.'}
              </p>
              <a href="/contact" className="text-primary hover:underline text-sm font-medium">
                {language === 'ka' ? 'დაგვიკავშირდით →' : 'Contact us →'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
