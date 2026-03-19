import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';

interface CategorySitemapSidebarProps {
  currentCategorySlug?: string;
}

export function CategorySitemapSidebar({ currentCategorySlug }: CategorySitemapSidebarProps) {
  const { language } = useLanguage();

  // Find the current category
  const currentCategory = categories.find(cat => cat.slug === currentCategorySlug);

  const priceRanges = [
    { href: '/search?maxPrice=20', label: 'Under ₾20', labelKa: '₾20-მდე' },
    { href: '/search?minPrice=20&maxPrice=50', label: '₾20-₾50', labelKa: '₾20-₾50' },
    { href: '/search?minPrice=50&maxPrice=100', label: '₾50-₾100', labelKa: '₾50-₾100' },
    { href: '/search?minPrice=100', label: '₾100+', labelKa: '₾100+' },
  ];

  const conditions = [
    { href: '/search?condition=new', label: 'New with Tags', labelKa: 'ახალი ეტიკეტით' },
    { href: '/search?condition=like_new', label: 'Like New', labelKa: 'თითქმის ახალი' },
    { href: '/search?condition=good', label: 'Good Condition', labelKa: 'კარგი მდგომარეობა' },
    { href: '/search?condition=fair', label: 'Fair Condition', labelKa: 'დამაკმაყოფილებელი' },
  ];

  const relatedCategories = categories
    .filter(cat => cat.slug !== currentCategorySlug)
    .slice(0, 5);

  return (
    <aside className="space-y-6">
      {/* Subcategories */}
      {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
        <div className="p-4 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-3 text-sm">
            {language === 'ka' 
              ? `დაათვალიერე ${currentCategory.nameKa}` 
              : `Browse ${currentCategory.name}`}
          </h3>
          <ul className="space-y-2">
            {currentCategory.subcategories.slice(0, 8).map((sub) => (
              <li key={sub.id}>
                <Link 
                  to={`/category/${sub.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span>{sub.icon}</span>
                  <span>{language === 'ka' ? sub.nameKa : sub.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price Range */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-foreground mb-3 text-sm">
          {language === 'ka' ? 'ფასის დიაპაზონი' : 'Price Range'}
        </h3>
        <ul className="space-y-2">
          {priceRanges.map((item) => (
            <li key={item.href}>
              <Link 
                to={currentCategorySlug ? `${item.href}&category=${currentCategorySlug}` : item.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {language === 'ka' ? item.labelKa : item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Condition */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-foreground mb-3 text-sm">
          {language === 'ka' ? 'მდგომარეობა' : 'Condition'}
        </h3>
        <ul className="space-y-2">
          {conditions.map((item) => (
            <li key={item.href}>
              <Link 
                to={currentCategorySlug ? `${item.href}&category=${currentCategorySlug}` : item.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {language === 'ka' ? item.labelKa : item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Related Categories */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-foreground mb-3 text-sm">
          {language === 'ka' ? 'მსგავსი კატეგორიები' : 'Related Categories'}
        </h3>
        <ul className="space-y-2">
          {relatedCategories.map((cat) => (
            <li key={cat.id}>
              <Link 
                to={`/category/${cat.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {language === 'ka' ? cat.nameKa : cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
