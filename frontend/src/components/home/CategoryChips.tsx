import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, getCategoryName } from '@/data/categories';
import { cn } from '@/lib/utils';

interface CategoryChipsProps {
  className?: string;
}

/**
 * Mobile-friendly horizontal scrollable category chips
 * Shows on homepage for quick category access
 */
export function CategoryChips({ className }: CategoryChipsProps) {
  const { language } = useLanguage();

  return (
    <div className={cn("md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4", className)}>
      <div className="flex gap-2 pb-1">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/search?category=${category.id}`}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full shrink-0",
              "bg-muted hover:bg-muted/80 active:scale-95",
              "text-sm font-medium text-foreground",
              "transition-all duration-150"
            )}
          >
            <span className="text-base" role="img" aria-hidden>
              {category.icon}
            </span>
            <span>{getCategoryName(category, language)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
