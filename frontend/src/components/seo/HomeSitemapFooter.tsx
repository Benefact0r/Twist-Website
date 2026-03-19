import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export function HomeSitemapFooter() {
  const { language } = useLanguage();

  const topCategories = [
    { href: '/category/women', label: "Women's Fashion", labelKa: 'ქალის მოდა' },
    { href: '/category/men', label: "Men's Fashion", labelKa: 'მამაკაცის მოდა' },
    { href: '/category/kids', label: 'Kids & Babies', labelKa: 'ბავშვები' },
  ];

  const howTwistWorks = [
    { href: '/buying', label: 'How to Buy Safely', labelKa: 'როგორ იყიდო უსაფრთხოდ' },
    { href: '/selling', label: 'How to Sell Fast', labelKa: 'როგორ გაყიდო სწრაფად' },
    { href: '/safety', label: 'Payment Protection', labelKa: 'გადახდის დაცვა' },
  ];

  const newToTwist = [
    { href: '/how-it-works', label: 'How Twist Works', labelKa: 'როგორ მუშაობს Twist' },
    { href: '/seller-guide', label: 'Seller Guide', labelKa: 'გამყიდველის გზამკვლევი' },
    { href: '/help-center', label: 'Help and Support', labelKa: 'დახმარება და მხარდაჭერა' },
  ];

  return (
    <section className="border-t border-border/40 bg-muted/10">
      <div className="container py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto text-center sm:text-left">
          <div>
            <h3 className="font-medium text-foreground/80 mb-3 text-xs uppercase tracking-wider">
              {language === 'ka' ? 'კატეგორიები' : 'Categories'}
            </h3>
            <ul className="space-y-2">
              {topCategories.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {language === 'ka' ? item.labelKa : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-foreground/80 mb-3 text-xs uppercase tracking-wider">
              {language === 'ka' ? 'როგორ მუშაობს' : 'How It Works'}
            </h3>
            <ul className="space-y-2">
              {howTwistWorks.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {language === 'ka' ? item.labelKa : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-medium text-foreground/80 mb-3 text-xs uppercase tracking-wider">
              {language === 'ka' ? 'პირველად ხარ?' : 'New Here?'}
            </h3>
            <ul className="space-y-2">
              {newToTwist.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {language === 'ka' ? item.labelKa : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
