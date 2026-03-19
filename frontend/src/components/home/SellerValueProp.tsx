import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Phone, Eye, Layers, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function SellerValueProp() {
  const { language } = useLanguage();

  const features = [
    {
      label: language === 'ka' ? 'ჩათი პირდაპირ აპში' : 'In-app chat',
      icon: MessageCircle
    },
    {
      label: language === 'ka' ? 'დარეკვა არ არის საჭირო' : 'No calls required',
      icon: Phone
    },
    {
      label: language === 'ka' ? 'ნივთი ჩანს ზუსტად ისე, როგორც არის' : 'Item shown exactly as is',
      icon: Eye
    },
    {
      label: language === 'ka' ? 'ყველაფერი ერთ სივრცეში' : 'Everything in one place',
      icon: Layers
    },
    {
      label: language === 'ka' ? 'უსაფრთხო გარიგება' : 'Secure transaction',
      icon: Shield
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left side - Text content */}
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {language === 'ka' ? (
                <>
                  რატომ <span className="text-primary">Twist</span>?
                  <br />
                  <span className="text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground mt-2 block">
                    ონლაინ ყიდვა და გაყიდვა არის ისეთი როგორიც უნდა იყოს.
                  </span>
                </>
              ) : (
                <>
                  Why <span className="text-primary">Twist</span>?
                  <br />
                  <span className="text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground mt-2 block">
                    Online buying and selling, as it should be.
                  </span>
                </>
              )}
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {language === 'ka' 
                ? 'ყველაფერი ხდება ერთ სივრცეში.'
                : 'Everything happens in-app — no unnecessary calls or confusion.'}
            </p>

            <Button size="lg" className="h-14 px-8 text-base font-bold rounded-full shadow-lg" asChild>
              <Link to="/sell">
                {language === 'ka' ? 'დაიწყე გაყიდვა' : 'Start Selling'}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Right side - Features list */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-muted/50 p-4 border-b border-border">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                  Twist
                </span>
              </div>

              {/* Features */}
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 border-b border-border last:border-0">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <feature.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
