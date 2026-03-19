import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, ArrowRight, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
export function FinalCTA() {
  const {
    language
  } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      toast.success(language === 'ka' ? 'გამოწერილი ხართ!' : 'Subscribed successfully!');
      setEmail('');
    }
  };
  const cities = language === 'ka' ? ['თბილისი'] : ['Tbilisi'];
  return <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(180_60%_35%)]" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
      backgroundSize: '24px 24px'
    }} />

      <div className="container relative z-10 max-w-4xl">
        <div className="text-center">

          {/* Main heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 animate-fade-in" style={{
          animationDelay: '100ms',
          letterSpacing: '-0.03em'
        }}>
            {language === 'ka' ? 'ყიდვა-გაყიდვის ახალი ერა დაიწყო.' : 'The New Era of Second-Hand Has Begun.'}
          </h2>

          {/* Subheading with cities */}
          

          {/* Cities */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in" style={{
          animationDelay: '250ms'
        }}>
            {cities.map((city, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {city}
              </span>
            ))}
          </div>


          {/* Email signup */}
          <div className="max-w-md mx-auto animate-fade-in" style={{
          animationDelay: '400ms'
        }}>
            <p className="text-white/60 text-sm mb-3">
              {language === 'ka' ? 'მიიღეთ განახლებები და ექსკლუზიური შეთავაზებები' : 'Get updates and exclusive offers'}
            </p>
            
            {isSubscribed ? <div className="flex items-center justify-center gap-2 px-6 py-4 bg-white/15 backdrop-blur-sm rounded-full text-white">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">
                  {language === 'ka' ? 'მადლობა გამოწერისთვის!' : 'Thanks for subscribing!'}
                </span>
              </div> : <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={language === 'ka' ? 'თქვენი ელ.ფოსტა' : 'Your email'} className="h-12 pl-12 rounded-full bg-card border-0 text-foreground placeholder:text-muted-foreground dark:bg-background dark:border dark:border-border" />
                </div>
                <Button type="submit" size="lg" className="h-12 px-6 rounded-full bg-foreground text-background hover:bg-foreground/90">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>}
          </div>
        </div>
      </div>
    </section>;
}