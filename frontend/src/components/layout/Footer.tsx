import { Link } from 'react-router-dom';
import { Facebook, Instagram, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import twistLogo from '@/assets/twist-logo-transparent.png';
import { useState } from 'react';

function FooterSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden sm:block">
        <h3 className="font-semibold text-foreground text-sm mb-4 tracking-wide">{title}</h3>
        <ul className="space-y-2.5">{children}</ul>
      </div>
      {/* Mobile: collapsible */}
      <Collapsible open={open} onOpenChange={setOpen} className="sm:hidden border-b border-border/40">
        <CollapsibleTrigger className="flex w-full items-center justify-between py-3.5">
          <span className="font-semibold text-foreground text-sm tracking-wide">{title}</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="space-y-2.5 pb-4">{children}</ul>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="text-[13px] text-muted-foreground hover:text-primary transition-colors leading-relaxed"
      >
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-border/60 bg-muted/20 dark:bg-muted/10 mt-auto">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-12 md:gap-16">
          {/* Column 1 — Brand */}
          <div className="mb-6 sm:mb-0">
            <Link to="/" className="inline-block mb-3">
              <img src={twistLogo} alt="Twist" className="h-7 w-auto object-contain" />
            </Link>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-5 max-w-[240px]">
              {language === 'ka'
                ? 'მეორადი ნივთების მარტივი და უსაფრთხო მარკეტპლეისი საქართველოში.'
                : 'The simple and safe marketplace for secondhand in Georgia.'}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/17xTnjcndq/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://www.facebook.com/share/17xTnjcndq/', '_blank', 'noopener,noreferrer');
                }}
                className="text-muted-foreground/60 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/60 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          {/* Column 2 — Company */}
          <FooterSection title={language === 'ka' ? 'კომპანია' : 'Company'}>
            <FooterLink to="/about">{language === 'ka' ? 'ჩვენ შესახებ' : 'About'}</FooterLink>
            <FooterLink to="/contact">{language === 'ka' ? 'კონტაქტი' : 'Contact'}</FooterLink>
            <FooterLink to="/help-center">{language === 'ka' ? 'ხშირი კითხვები' : 'FAQ'}</FooterLink>
            <FooterLink to="/terms">{language === 'ka' ? 'წესები და პირობები' : 'Terms & Conditions'}</FooterLink>
            <FooterLink to="/privacy">{language === 'ka' ? 'კონფიდენციალურობა' : 'Privacy Policy'}</FooterLink>
          </FooterSection>

          {/* Column 3 — Help */}
          <FooterSection title={language === 'ka' ? 'დახმარება' : 'Help'}>
            <FooterLink to="/how-it-works">{language === 'ka' ? 'როგორ მუშაობს Twist' : 'How Twist Works'}</FooterLink>
            <FooterLink to="/buyer-protection">{language === 'ka' ? 'მყიდველის დაცვა' : 'Buyer Protection'}</FooterLink>
            <FooterLink to="/seller-guide">{language === 'ka' ? 'გამყიდველის გზამკვლევი' : 'Seller Guide'}</FooterLink>
            <FooterLink to="/safety">{language === 'ka' ? 'უსაფრთხოება' : 'Trust & Safety'}</FooterLink>
          </FooterSection>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="container py-4 flex items-center justify-center">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Twist
          </p>
        </div>
      </div>
    </footer>
  );
}
