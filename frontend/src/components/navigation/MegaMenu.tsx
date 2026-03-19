import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, Grid3X3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, getCategoryName } from '@/data/categories';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface MegaMenuProps {
  className?: string;
}

export function MegaMenu({ className }: MegaMenuProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<Category | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current category from URL
  const currentCategoryId = searchParams.get('category');

  // Clear any pending close timeout
  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  // Schedule menu close with delay
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
      setActiveSubcategory(null);
    }, 150);
  }, [cancelClose]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
        setActiveSubcategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      cancelClose();
    };
  }, [cancelClose]);

  // INSTANT hover - no delay on opening
  const handleCategoryEnter = (categoryId: string) => {
    cancelClose();
    setActiveCategory(categoryId);
    
    // Auto-select first subcategory
    const category = categories.find(c => c.id === categoryId);
    if (category?.subcategories?.length) {
      setActiveSubcategory(category.subcategories[0]);
    } else {
      setActiveSubcategory(null);
    }
  };

  const handleDropdownEnter = () => {
    cancelClose();
  };

  const handleMenuLeave = () => {
    scheduleClose();
  };

  const handleSubcategoryHover = (subcategory: Category) => {
    setActiveSubcategory(subcategory);
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  const activeCategoryData = categories.find(c => c.id === activeCategory);

  return (
    <nav 
      ref={menuRef} 
      className={cn("hidden md:block border-t border-border/50 bg-card relative", className)}
    >
      <div className="container">
        {/* Category tabs */}
        <ul className="flex items-center gap-1" role="menubar">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const isCurrentPage = currentCategoryId === category.id;
            
            return (
              <li key={category.id} role="none">
                <button
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded={isActive}
                  onMouseEnter={() => handleCategoryEnter(category.id)}
                  onMouseLeave={handleMenuLeave}
                  onFocus={() => handleCategoryEnter(category.id)}
                  onClick={() => handleCategoryClick(category.id)}
                  className={cn(
                    "relative px-4 py-3.5 text-sm font-medium transition-colors duration-150",
                    isActive || isCurrentPage
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {getCategoryName(category, language)}
                  
                  {/* Active underline indicator */}
                  <span 
                    className={cn(
                      "absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full transition-transform duration-150 origin-left",
                      isActive || isCurrentPage ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mega menu dropdown - appears instantly on hover */}
      <div
        className={cn(
          "absolute left-0 right-0 top-full bg-card border-b border-border shadow-xl z-50",
          "transition-all duration-150 ease-out origin-top",
          activeCategory && activeCategoryData?.subcategories?.length
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
        onMouseEnter={handleDropdownEnter}
        onMouseLeave={handleMenuLeave}
        role="menu"
        aria-label={activeCategoryData ? getCategoryName(activeCategoryData, language) : undefined}
      >
        {activeCategoryData && activeCategoryData.subcategories && (
          <div className="container py-5">
            <div className="flex gap-8">
              {/* Left column - Subcategories list */}
              <div className="w-60 shrink-0">
                {/* See All link */}
                <Link
                  to={`/search?category=${activeCategory}`}
                  onClick={() => { setActiveCategory(null); setActiveSubcategory(null); }}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold",
                    "text-primary bg-primary/5 hover:bg-primary/10 transition-colors duration-150",
                    "mb-2"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span>
                    {language === 'ka' 
                      ? `ყველა ${getCategoryName(activeCategoryData, language)}`
                      : `All ${getCategoryName(activeCategoryData, language)}`
                    }
                  </span>
                </Link>

                <div className="border-t border-border/50 pt-2 mt-2">
                  {activeCategoryData.subcategories.map((subcategory) => {
                    const isSubActive = activeSubcategory?.id === subcategory.id;
                    
                    return (
                      <button
                        key={subcategory.id}
                        role="menuitem"
                        onMouseEnter={() => handleSubcategoryHover(subcategory)}
                        onFocus={() => handleSubcategoryHover(subcategory)}
                        onClick={() => handleCategoryClick(subcategory.id)}
                        className={cn(
                          "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left",
                          "transition-all duration-150",
                          isSubActive
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <span>{getCategoryName(subcategory, language)}</span>
                        {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform duration-150",
                            isSubActive ? "translate-x-0.5 text-primary" : "text-muted-foreground/50"
                          )} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vertical divider */}
              <div className="w-px bg-border/50" />

              {/* Right content area - Sub-subcategories or direct link */}
              <div className="flex-1 min-w-0">
                {activeSubcategory && activeSubcategory.subcategories && activeSubcategory.subcategories.length > 0 ? (
                  <div className="space-y-4">
                    {/* Subcategory header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        {getCategoryName(activeSubcategory, language)}
                      </h3>
                      <Link
                        to={`/search?category=${activeSubcategory.id}`}
                        onClick={() => { setActiveCategory(null); setActiveSubcategory(null); }}
                        className="text-sm font-medium text-primary hover:underline transition-colors"
                      >
                        {language === 'ka' ? 'ყველას ნახვა' : 'View all'} →
                      </Link>
                    </div>
                    
                    {/* Sub-subcategories grid */}
                    <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                      {activeSubcategory.subcategories.map((item) => (
                        <Link
                          key={item.id}
                          to={`/search?category=${item.id}`}
                          onClick={() => { setActiveCategory(null); setActiveSubcategory(null); }}
                          className={cn(
                            "py-2 px-2 -mx-2 rounded-md text-sm",
                            "text-muted-foreground hover:text-primary hover:bg-primary/5",
                            "transition-colors duration-150"
                          )}
                        >
                          {getCategoryName(item, language)}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : activeSubcategory ? (
                  /* No sub-subcategories - show direct browse link */
                  <div className="flex flex-col items-start justify-center h-full py-8">
                    <h3 className="font-semibold text-foreground mb-3">
                      {getCategoryName(activeSubcategory, language)}
                    </h3>
                    <Link
                      to={`/search?category=${activeSubcategory.id}`}
                      onClick={() => { setActiveCategory(null); setActiveSubcategory(null); }}
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2.5 rounded-full",
                        "bg-primary text-primary-foreground font-medium text-sm",
                        "hover:bg-primary/90 transition-colors duration-150"
                      )}
                    >
                      {language === 'ka' 
                        ? `${getCategoryName(activeSubcategory, language)}-ს დათვალიერება`
                        : `Browse ${getCategoryName(activeSubcategory, language)}`
                      }
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
