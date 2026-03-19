import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Recycle, Heart, Shield, Users } from 'lucide-react';

export default function About() {
  const { language } = useLanguage();

  const values = [
    {
      icon: Shield,
      title: language === 'ka' ? 'უსაფრთხოება' : 'Safety',
      description: language === 'ka' 
        ? 'ყველა ტრანზაქცია დაცულია. თქვენი ფული უსაფრთხოდ ინახება სანამ ნივთს არ მიიღებთ.'
        : 'Every transaction is protected. Your money is held safely until you receive your item.'
    },
    {
      icon: Recycle,
      title: language === 'ka' ? 'მდგრადობა' : 'Sustainability',
      description: language === 'ka'
        ? 'ნივთების ხელახალი გამოყენება ამცირებს ნარჩენებს და იცავს გარემოს.'
        : 'Reusing items reduces waste and protects our environment.'
    },
    {
      icon: Users,
      title: language === 'ka' ? 'საზოგადოება' : 'Community',
      description: language === 'ka'
        ? 'ვაკავშირებთ ადამიანებს მთელი საქართველოს მასშტაბით.'
        : 'We connect people across all of Georgia.'
    },
    {
      icon: Heart,
      title: language === 'ka' ? 'სიმარტივე' : 'Simplicity',
      description: language === 'ka'
        ? 'მარტივი და გასაგები პროცესი ყიდვისა და გაყიდვისთვის.'
        : 'Simple and clear process for buying and selling.'
    }
  ];

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          {language === 'ka' ? 'ჩვენ შესახებ' : 'About Us'}
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {language === 'ka' 
              ? 'Twist არის საქართველოს თანამედროვე მეორადი ნივთების მარკეტპლეისი. ჩვენ შევქმენით პლატფორმა, სადაც ყიდვა და გაყიდვა მარტივი, უსაფრთხო და სასიამოვნოა.'
              : 'Twist is Georgia\'s modern second-hand marketplace. We created a platform where buying and selling is simple, safe, and enjoyable.'}
          </p>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              {language === 'ka' ? 'ჩვენი მისია' : 'Our Mission'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'ka'
                ? 'გავამარტივოთ მეორადი ნივთების ყიდვა-გაყიდვა საქართველოში. გვსურს შევქმნათ სანდო პლატფორმა, სადაც ყველას შეუძლია მარტივად იყიდოს ან გაყიდოს ნივთები — უსაფრთხოდ და გამჭვირვალედ.'
                : 'To simplify buying and selling second-hand items in Georgia. We want to create a trusted platform where everyone can easily buy or sell items — safely and transparently.'}
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {language === 'ka' ? 'ჩვენი ღირებულებები' : 'Our Values'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {values.map((value, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              {language === 'ka' ? 'რატომ Twist?' : 'Why Twist?'}
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {language === 'ka' 
                  ? 'კარიდან კარამდე მიწოდება მთელი საქართველოს მასშტაბით'
                  : 'Door-to-door delivery across all of Georgia'}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {language === 'ka'
                  ? 'დაცული გადახდები — ფული ირიცხება მხოლოდ ნივთის მიღების შემდეგ'
                  : 'Protected payments — money is transferred only after receiving the item'}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {language === 'ka'
                  ? 'არანაირი საკომისიო გამყიდველისთვის'
                  : 'No commission for sellers'}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {language === 'ka'
                  ? 'თანამედროვე და მარტივი ინტერფეისი'
                  : 'Modern and simple interface'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
