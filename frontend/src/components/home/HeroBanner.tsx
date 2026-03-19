import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-lifestyle-hd.png';

// Cache bust version - increment when hero image changes
const HERO_VERSION = 'v2';

export function HeroBanner() {
  const { language } = useLanguage();
  
  // Add cache busting to force reload of new image
  const heroImageUrl = `${heroImage}?${HERO_VERSION}`;

  return (
    <section className="relative w-full h-[55vh] min-h-[400px] max-h-[550px] overflow-hidden">
      {/* Full-width background image */}
      <div 
        className="absolute inset-0 bg-cover bg-[center_top] bg-no-repeat"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        {/* Subtle overlay for better text readability on left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent dark:from-background/70 dark:via-background/30 dark:to-transparent" />
      </div>

      {/* CTA Card - positioned on the left */}
      <div className="relative h-full container flex items-center">
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] dark:border dark:border-border p-8 md:p-10 max-w-sm animate-fade-in">
          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              size="lg" 
              className="w-full h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
              asChild
            >
              <Link to="/search">
                {language === 'ka' ? 'მოძებნე ნივთები' : 'Browse items'}
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-14 text-base font-semibold rounded-xl border-2 border-foreground/15 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              asChild
            >
              <Link to="/sell">
                {language === 'ka' ? 'გაყიდე ნივთი' : 'Sell an item'}
              </Link>
            </Button>
          </div>

          {/* Early Access Notice */}
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-muted/60 border border-border/50 px-4 py-3">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {language === 'ka'
                ? 'Twist ახლა სატესტო რეჟიმშია. გადახდებისა და მიწოდების ფუნქციები გააქტიურდება ჩაშვების დროს.'
                : 'Twist is currently in Early Access. Payments and delivery features will be activated at official launch.'}
            </p>
          </div>

          {/* Learn more link */}
          <div className="mt-4 text-center">
            <Link 
              to="/how-it-works" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              {language === 'ka' ? 'როგორ მუშაობს?' : 'Learn how it works'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}