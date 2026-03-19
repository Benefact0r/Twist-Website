import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Tag, User, Eye } from 'lucide-react';

interface ListingRelatedLinksProps {
  categorySlug?: string;
  categoryName?: string;
  categoryNameKa?: string;
  sellerId?: string;
  sellerName?: string;
}

export function ListingRelatedLinks({
  categorySlug,
  categoryName,
  categoryNameKa,
  sellerId,
  sellerName,
}: ListingRelatedLinksProps) {
  const { language } = useLanguage();

  const buyingTips = [
    { label: 'How to Check Item Condition', labelKa: 'როგორ შეამოწმო ნივთის მდგომარეობა', href: '/buying' },
    { label: 'Safe Payment Guide', labelKa: 'უსაფრთხო გადახდის გზამკვლევი', href: '/safety' },
    { label: 'Return Policy', labelKa: 'დაბრუნების პოლიტიკა', href: '/help-center' },
  ];

  return (
    <section className="border-t border-border mt-8 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Similar Items */}
        {categorySlug && (
          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              {language === 'ka' ? 'მსგავსი ნივთები' : 'Similar Items'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to={`/category/${categorySlug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>
                    {language === 'ka' 
                      ? `მეტი ${categoryNameKa || categoryName}-ში` 
                      : `More in ${categoryName}`}
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  to={`/search?category=${categorySlug}&condition=like_new`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>{language === 'ka' ? 'თითქმის ახალი ნივთები' : 'Like New Items'}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/search?sort=newest"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>{language === 'ka' ? 'ახლად დამატებული' : 'Recently Added'}</span>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Seller's Other Items */}
        {sellerId && (
          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {language === 'ka' ? 'გამყიდველის სხვა ნივთები' : "Seller's Other Items"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to={`/search?seller=${sellerId}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group"
                >
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  <span>
                    {language === 'ka' 
                      ? `${sellerName || 'გამყიდველის'} ყველა ნივთი` 
                      : `All items from ${sellerName || 'this seller'}`}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Buying Tips */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            {language === 'ka' ? 'ყიდვის რჩევები' : 'Buying Tips'}
          </h3>
          <ul className="space-y-2">
            {buyingTips.map((item) => (
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
    </section>
  );
}
