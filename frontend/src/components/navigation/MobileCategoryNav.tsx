import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Grid3X3, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, getCategoryName } from '@/data/categories';
import { Category } from '@/types';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface MobileCategoryNavProps {
  trigger?: React.ReactNode;
  className?: string;
}

export function MobileCategoryNav({ trigger, className }: MobileCategoryNavProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/search?category=${categoryId}`);
    setIsOpen(false);
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const goBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Determine what to show based on navigation state
  const showMainCategories = !selectedCategory;
  const showSubcategories = selectedCategory && !selectedSubcategory;
  const showSubSubcategories = selectedCategory && selectedSubcategory;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetSelection(); }}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className={className}>
            {language === 'ka' ? 'კატეგორიები' : 'Categories'}
          </Button>
        )}
      </SheetTrigger>
      
      <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-4 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            {(selectedCategory || selectedSubcategory) && (
              <button
                onClick={goBack}
                className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
                aria-label={language === 'ka' ? 'უკან' : 'Back'}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <SheetTitle className="text-lg font-semibold">
              {showSubSubcategories && selectedSubcategory
                ? getCategoryName(selectedSubcategory, language)
                : showSubcategories && selectedCategory
                  ? getCategoryName(selectedCategory, language)
                  : language === 'ka' ? 'კატეგორიები' : 'Categories'
              }
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Categories */}
          {showMainCategories && (
            <nav className="py-2" aria-label="Main categories">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    if (category.subcategories?.length) {
                      setSelectedCategory(category);
                    } else {
                      handleCategoryClick(category.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-5 py-4",
                    "text-left hover:bg-muted/50 active:bg-muted transition-colors",
                    "border-b border-border/50 last:border-0"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden>
                      {category.icon}
                    </span>
                    <span className="font-medium text-foreground">
                      {getCategoryName(category, language)}
                    </span>
                  </div>
                  {category.subcategories?.length ? (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  ) : null}
                </button>
              ))}
            </nav>
          )}

          {/* Subcategories */}
          {showSubcategories && selectedCategory && (
            <nav className="py-2" aria-label={`${getCategoryName(selectedCategory, language)} subcategories`}>
              {/* See All button */}
              <button
                onClick={() => handleCategoryClick(selectedCategory.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-4",
                  "text-left bg-primary/5 hover:bg-primary/10 active:bg-primary/15",
                  "border-b border-border/50 transition-colors"
                )}
              >
                <Grid3X3 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">
                  {language === 'ka' 
                    ? `ყველა ${getCategoryName(selectedCategory, language)}`
                    : `All ${getCategoryName(selectedCategory, language)}`
                  }
                </span>
              </button>

              {/* Subcategory list */}
              {selectedCategory.subcategories?.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => {
                    if (subcategory.subcategories?.length) {
                      setSelectedSubcategory(subcategory);
                    } else {
                      handleCategoryClick(subcategory.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-5 py-4",
                    "text-left hover:bg-muted/50 active:bg-muted transition-colors",
                    "border-b border-border/50 last:border-0"
                  )}
                >
                  <span className="text-foreground">
                    {getCategoryName(subcategory, language)}
                  </span>
                  {subcategory.subcategories?.length ? (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  ) : null}
                </button>
              ))}
            </nav>
          )}

          {/* Sub-subcategories */}
          {showSubSubcategories && selectedSubcategory && (
            <nav className="py-2" aria-label={`${getCategoryName(selectedSubcategory, language)} items`}>
              {/* See All button */}
              <button
                onClick={() => handleCategoryClick(selectedSubcategory.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-4",
                  "text-left bg-primary/5 hover:bg-primary/10 active:bg-primary/15",
                  "border-b border-border/50 transition-colors"
                )}
              >
                <Grid3X3 className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">
                  {language === 'ka' 
                    ? `ყველა ${getCategoryName(selectedSubcategory, language)}`
                    : `All ${getCategoryName(selectedSubcategory, language)}`
                  }
                </span>
              </button>

              {/* Sub-subcategory list */}
              {selectedSubcategory.subcategories?.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleCategoryClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-4",
                    "text-left hover:bg-muted/50 active:bg-muted transition-colors",
                    "border-b border-border/50 last:border-0"
                  )}
                >
                  <span className="text-foreground">
                    {getCategoryName(item, language)}
                  </span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
