import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Contact() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(
      language === 'ka' 
        ? 'შეტყობინება გაიგზავნა! მალე დაგიკავშირდებით.' 
        : 'Message sent! We will contact you soon.'
    );
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {language === 'ka' ? 'კონტაქტი' : 'Contact'}
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          {language === 'ka'
            ? 'გაქვთ კითხვა ან გჭირდებათ დახმარება? მოგვწერეთ!'
            : 'Have a question or need help? Write to us!'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {language === 'ka' ? 'ელ-ფოსტა' : 'Email'}
                  </h3>
                  <a 
                    href="mailto:Twistingsocials@gmail.com" 
                    className="text-primary hover:underline"
                  >
                    Twistingsocials@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {language === 'ka' ? 'პასუხის დრო' : 'Response Time'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'ka'
                      ? 'ჩვეულებრივ ვპასუხობთ 24 საათის განმავლობაში'
                      : 'We usually respond within 24 hours'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {language === 'ka' ? 'სწრაფი დახმარება' : 'Quick Help'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'ka'
                      ? 'პასუხები ხშირ კითხვებზე იხილეთ დახმარების ცენტრში'
                      : 'Find answers to common questions in Help Center'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {language === 'ka' ? 'მოგვწერეთ' : 'Send us a message'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">
                  {language === 'ka' ? 'სახელი' : 'Name'}
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  placeholder={language === 'ka' ? 'თქვენი სახელი' : 'Your name'}
                />
              </div>
              <div>
                <Label htmlFor="email">
                  {language === 'ka' ? 'ელ-ფოსტა' : 'Email'}
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder={language === 'ka' ? 'თქვენი ელ-ფოსტა' : 'Your email'}
                />
              </div>
              <div>
                <Label htmlFor="subject">
                  {language === 'ka' ? 'თემა' : 'Subject'}
                </Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  required 
                  placeholder={language === 'ka' ? 'რაზე გვწერთ?' : 'What is this about?'}
                />
              </div>
              <div>
                <Label htmlFor="message">
                  {language === 'ka' ? 'შეტყობინება' : 'Message'}
                </Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required 
                  rows={4}
                  placeholder={language === 'ka' ? 'თქვენი შეტყობინება...' : 'Your message...'}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting 
                  ? (language === 'ka' ? 'იგზავნება...' : 'Sending...')
                  : (language === 'ka' ? 'გაგზავნა' : 'Send')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
