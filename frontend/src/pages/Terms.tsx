import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText } from 'lucide-react';

const Terms = () => {
  const { language } = useLanguage();

  const sections = [
    {
      title: language === 'ka' ? 'პლატფორმის როლი' : 'Platform Role',
      content: language === 'ka'
        ? 'Twist არის პლატფორმა, რომელიც აკავშირებს მყიდველებსა და გამყიდველებს. Twist არ არის ნივთების გამყიდველი და არ იღებს პასუხისმგებლობას ნივთების ხარისხზე ან მდგომარეობაზე. თითოეული ტრანზაქცია ხორციელდება მომხმარებლებს შორის.'
        : 'Twist is a platform that connects buyers and sellers. Twist is not the seller of items and does not assume responsibility for item quality or condition. Each transaction takes place between users.'
    },
    {
      title: language === 'ka' ? 'მომხმარებლის პასუხისმგებლობა' : 'User Responsibility',
      content: language === 'ka'
        ? 'მომხმარებლები პასუხისმგებელნი არიან თავიანთ განცხადებებზე, კომუნიკაციაზე და ქცევაზე პლატფორმაზე. გამყიდველები პასუხისმგებელნი არიან ზუსტი ინფორმაციის მიწოდებაზე, მყიდველები კი — წესების დაცვაზე.'
        : 'Users are responsible for their listings, communications, and behavior on the platform. Sellers are responsible for providing accurate information, and buyers are responsible for following the rules.'
    },
    {
      title: language === 'ka' ? 'კონტენტის მართვა' : 'Content Management',
      content: language === 'ka'
        ? 'Twist იტოვებს უფლებას წაშალოს ნებისმიერი განცხადება ან კონტენტი, რომელიც არღვევს ჩვენს წესებს. ანგარიშები შეიძლება შეიზღუდოს ან დაიბლოკოს სერიოზული ან განმეორებითი დარღვევების შემთხვევაში.'
        : 'Twist reserves the right to remove any listing or content that violates our rules. Accounts may be restricted or blocked for serious or repeated violations.'
    },
    {
      title: language === 'ka' ? 'პლატფორმის გამოყენება' : 'Use of Platform',
      content: language === 'ka'
        ? 'პლატფორმის გამოყენებით თქვენ ეთანხმებით ამ პირობებს და საზოგადოების წესებს. თქვენ უნდა იყოთ სრულწლოვანი ანგარიშის შესაქმნელად.'
        : 'By using the platform, you agree to these terms and our community rules. You must be of legal age to create an account.'
    },
    {
      title: language === 'ka' ? 'ცვლილებები' : 'Changes',
      content: language === 'ka'
        ? 'Twist-ს შეუძლია შეცვალოს ეს პირობები. მნიშვნელოვანი ცვლილებების შემთხვევაში მომხმარებლებს ეცნობებათ. პლატფორმის გამოყენების გაგრძელება ნიშნავს თანხმობას ახალ პირობებზე.'
        : 'Twist may modify these terms. Users will be notified of significant changes. Continued use of the platform constitutes agreement to the new terms.'
    },
  ];

  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === 'ka' ? 'მომსახურების პირობები' : 'Terms & Conditions'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ka' 
              ? 'გთხოვთ გაეცნოთ Twist-ის გამოყენების პირობებს.'
              : 'Please review the terms of using Twist.'}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {language === 'ka' ? 'ბოლო განახლება: იანვარი 2026' : 'Last updated: January 2026'}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-3">
            {language === 'ka'
              ? 'გაქვთ კითხვები პირობებთან დაკავშირებით?'
              : 'Have questions about these terms?'}
          </p>
          <a href="/contact" className="text-primary hover:underline font-medium">
            {language === 'ka' ? 'დაგვიკავშირდით →' : 'Contact us →'}
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
