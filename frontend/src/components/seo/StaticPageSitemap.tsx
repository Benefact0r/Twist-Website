import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

interface StaticPageSitemapProps {
  pageType?: 'how-it-works' | 'safety' | 'buying' | 'selling' | 'help';
}

export function StaticPageSitemap({ pageType = 'how-it-works' }: StaticPageSitemapProps) {
  const { language } = useLanguage();

  const forBuyers = [
    { step: 1, label: 'Browse & Find', labelKa: 'დაათვალიერე და იპოვე', href: '/search' },
    { step: 2, label: 'Make Offer/Chat', labelKa: 'გააკეთე შეთავაზება', href: '/messages' },
    { step: 3, label: 'Secure Payment', labelKa: 'უსაფრთხო გადახდა', href: '/safety' },
    { step: 4, label: 'Delivery Tracking', labelKa: 'მიწოდების თვალყურის დევნება', href: '/shipping-info' },
    { step: 5, label: 'Receive & Confirm', labelKa: 'მიიღე და დაადასტურე', href: '/buying' },
  ];

  const forSellers = [
    { step: 1, label: 'Snap Photos', labelKa: 'გადაიღე ფოტოები', href: '/seller-guide' },
    { step: 2, label: 'Set Price & Details', labelKa: 'დააყენე ფასი და დეტალები', href: '/sell' },
    { step: 3, label: 'Accept Offers', labelKa: 'მიიღე შეთავაზებები', href: '/messages' },
    { step: 4, label: 'Package Item', labelKa: 'შეფუთე ნივთი', href: '/shipping-info' },
    { step: 5, label: 'Courier Pickup', labelKa: 'კურიერის გაგზავნა', href: '/shipping-info' },
    { step: 6, label: 'Get Paid', labelKa: 'მიიღე თანხა', href: '/pricing' },
  ];

  const nextSteps = [
    { label: 'Start Browsing', labelKa: 'დაიწყე დათვალიერება', href: '/search' },
    { label: 'Create First Listing', labelKa: 'შექმენი პირველი განცხადება', href: '/sell' },
    { label: 'Read Safety Guide', labelKa: 'წაიკითხე უსაფრთხოების გზამკვლევი', href: '/safety' },
    { label: 'Visit Help Center', labelKa: 'ეწვიე დახმარების ცენტრს', href: '/help-center' },
  ];

  const relatedGuides = [
    { label: 'Safety & Trust', labelKa: 'უსაფრთხოება და ნდობა', href: '/safety' },
    { label: 'Delivery Timeline', labelKa: 'მიწოდების ვადები', href: '/shipping-info' },
    { label: 'Payment Methods', labelKa: 'გადახდის მეთოდები', href: '/pricing' },
    { label: 'Returns & Refunds', labelKa: 'დაბრუნება და თანხის ანაზღაურება', href: '/help-center' },
  ];

  return (
    <section className="border-t border-border bg-muted/20 mt-12">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* For Buyers */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">
              {language === 'ka' ? 'მყიდველებისთვის' : 'For Buyers'}
            </h3>
            <ul className="space-y-2">
              {forBuyers.map((item) => (
                <li key={item.step}>
                  <Link 
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                      {item.step}
                    </span>
                    <span>{language === 'ka' ? item.labelKa : item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">
              {language === 'ka' ? 'გამყიდველებისთვის' : 'For Sellers'}
            </h3>
            <ul className="space-y-2">
              {forSellers.map((item) => (
                <li key={item.step}>
                  <Link 
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                      {item.step}
                    </span>
                    <span>{language === 'ka' ? item.labelKa : item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">
              {language === 'ka' ? 'შემდეგი ნაბიჯები' : 'Next Steps'}
            </h3>
            <ul className="space-y-2">
              {nextSteps.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    <span>{language === 'ka' ? item.labelKa : item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Guides */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">
              {language === 'ka' ? 'დაკავშირებული გზამკვლევები' : 'Related Guides'}
            </h3>
            <ul className="space-y-2">
              {relatedGuides.map((item) => (
                <li key={item.href}>
                  <Link 
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
