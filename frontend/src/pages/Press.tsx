import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Press() {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          {language === 'ka' ? 'მედია / პრესა' : 'Media / Press'}
        </h1>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {language === 'ka' ? 'Twist-ის შესახებ' : 'About Twist'}
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {language === 'ka'
              ? 'Twist არის ქართული სტარტაპი, რომელიც აშენებს თანამედროვე მეორადი ნივთების მარკეტპლეისს. ჩვენი მიზანია გავამარტივოთ ყიდვა-გაყიდვის პროცესი და შევქმნათ უსაფრთხო, სანდო პლატფორმა საქართველოს მოსახლეობისთვის.'
              : 'Twist is a Georgian startup building a modern resale marketplace. Our goal is to simplify the buying and selling process and create a safe, trusted platform for the Georgian population.'}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {language === 'ka'
              ? 'პლატფორმა გთავაზობთ კარიდან კარამდე მიწოდებას, დაცულ გადახდებს და მარტივ ინტერფეისს.'
              : 'The platform offers door-to-door delivery, secure payments, and a simple interface.'}
          </p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {language === 'ka' ? 'მედია მოთხოვნები' : 'Media Inquiries'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'ka'
              ? 'ინტერვიუებისთვის, კომენტარებისთვის ან სხვა მედია მოთხოვნებისთვის, გთხოვთ დაგვიკავშირდეთ:'
              : 'For interviews, comments, or other media inquiries, please contact us:'}
          </p>
          
          <a 
            href="mailto:Twistingsocials@gmail.com" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <Mail className="h-5 w-5" />
            Twistingsocials@gmail.com
          </a>
        </div>

        <div className="mt-8 bg-muted/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {language === 'ka' ? 'ძირითადი ფაქტები' : 'Key Facts'}
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {language === 'ka' ? 'დაარსდა: 2025' : 'Founded: 2025'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {language === 'ka' ? 'ადგილმდებარეობა: თბილისი, საქართველო' : 'Location: Tbilisi, Georgia'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {language === 'ka' ? 'სფერო: მეორადი ნივთების მარკეტპლეისი' : 'Industry: Second-hand marketplace'}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {language === 'ka' ? 'მომსახურება: კარიდან კარამდე მიწოდება მთელი საქართველოს მასშტაბით' : 'Service: Door-to-door delivery across Georgia'}
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
