import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryPath, getCategoryName } from '@/data/categories';
import { cn } from '@/lib/utils';

interface CategoryBreadcrumbProps {
  categoryId: string;
  showHome?: boolean;
  className?: string;
}

export function CategoryBreadcrumb({ 
  categoryId, 
  showHome = true,
  className 
}: CategoryBreadcrumbProps) {
  const { language } = useLanguage();
  const path = getCategoryPath(categoryId);

  if (path.length === 0) return null;

  return (
    <nav 
      className={cn("flex items-center gap-1 text-sm", className)}
      aria-label="Breadcrumb"
    >
      {showHome && (
        <>
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        </>
      )}
      
      {path.map((category, index) => {
        const isLast = index === path.length - 1;
        
        return (
          <div key={category.id} className="flex items-center gap-1">
            {isLast ? (
              <span className="font-medium text-foreground">
                {getCategoryName(category, language)}
              </span>
            ) : (
              <>
                <Link
                  to={`/search?category=${category.id}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {getCategoryName(category, language)}
                </Link>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}
