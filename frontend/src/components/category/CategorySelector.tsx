import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Check, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category } from '@/types';
import { categories, getCategoryPath, getCategoryName } from '@/data/categories';

interface CategorySelectorProps {
  value?: string;
  onChange: (categoryId: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function CategorySelector({ 
  value, 
  onChange, 
  placeholder,
  required,
  className 
}: CategorySelectorProps) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Get the path for the selected category
  const selectedPath = value ? getCategoryPath(value) : [];
  const selectedCategory = selectedPath.length > 0 ? selectedPath[selectedPath.length - 1] : null;

  // Auto-expand parent categories when a value is selected
  useEffect(() => {
    if (value) {
      const path = getCategoryPath(value);
      const parentIds = path.slice(0, -1).map(cat => cat.id);
      setExpandedCategories(new Set(parentIds));
    }
  }, [value]);

  const toggleExpand = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleSelect = (category: Category) => {
    onChange(category.id);
    if (!category.subcategories || category.subcategories.length === 0) {
      setIsOpen(false);
    }
  };

  // Filter categories based on search
  const filterCategories = (cats: Category[]): Category[] => {
    if (!searchQuery) return cats;
    
    const query = searchQuery.toLowerCase();
    const filtered: Category[] = [];
    
    const search = (cat: Category): boolean => {
      const nameMatch = getCategoryName(cat, language).toLowerCase().includes(query);
      let hasMatchingChild = false;
      
      if (cat.subcategories) {
        const matchingChildren = cat.subcategories.filter(sub => search(sub));
        if (matchingChildren.length > 0) {
          hasMatchingChild = true;
        }
      }
      
      return nameMatch || hasMatchingChild;
    };
    
    cats.forEach(cat => {
      if (search(cat)) {
        filtered.push(cat);
      }
    });
    
    return filtered;
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = value === category.id;
    const isInPath = selectedPath.some(c => c.id === category.id);
    
    return (
      <div key={category.id}>
        <button
          type="button"
          onClick={(e) => {
            if (hasChildren) {
              toggleExpand(category.id, e);
            }
            handleSelect(category);
          }}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-colors",
            "hover:bg-muted",
            isSelected && "bg-primary/10 text-primary font-medium",
            isInPath && !isSelected && "text-primary/70",
            level > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {hasChildren ? (
            <span 
              onClick={(e) => toggleExpand(category.id, e)}
              className="p-0.5 -ml-1 rounded hover:bg-muted-foreground/10"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </span>
          ) : (
            <span className="w-5" />
          )}
          
          <span className="text-lg">{category.icon}</span>
          <span className="flex-1 truncate">
            {getCategoryName(category, language)}
          </span>
          
          {isSelected && (
            <Check className="h-4 w-4 text-primary shrink-0" />
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className="animate-accordion-down">
            {category.subcategories!.map(sub => renderCategory(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const displayValue = selectedCategory
    ? getCategoryPath(selectedCategory.id)
        .map(c => getCategoryName(c, language))
        .join(' › ')
    : '';

  return (
    <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-4 rounded-xl border border-input bg-background text-left flex items-center gap-2",
          "hover:bg-muted/50 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          !selectedCategory && "text-muted-foreground"
        )}
      >
        {selectedCategory ? (
          <>
            <span className="text-lg">{selectedCategory.icon}</span>
            <span className="flex-1 truncate text-sm">{displayValue}</span>
          </>
        ) : (
          <span className="flex-1 text-sm">
            {placeholder || t('sell.selectCategory')}
          </span>
        )}
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute z-50 mt-2 w-full max-h-[400px] overflow-hidden rounded-xl border border-border bg-card shadow-lg animate-in fade-in-0 zoom-in-95">
            {/* Search */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={language === 'ka' ? 'კატეგორიის ძიება...' : 'Search categories...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Category List */}
            <div className="overflow-y-auto max-h-[320px] p-2">
              {filterCategories(categories).map(cat => renderCategory(cat))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
