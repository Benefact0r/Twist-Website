import { useState } from 'react';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category } from '@/types';
import { categories, getCategoryName, getDescendantIds } from '@/data/categories';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategories: string[];
  onChange: (categoryIds: string[]) => void;
  showCounts?: boolean;
  counts?: Record<string, number>;
  className?: string;
}

export function CategoryFilter({ 
  selectedCategories, 
  onChange,
  showCounts,
  counts,
  className 
}: CategoryFilterProps) {
  const { language } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.id)) // Expand root categories by default
  );

  const toggleExpand = (categoryId: string) => {
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

  const handleToggle = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);
    
    if (isSelected) {
      // Remove this category and all descendants
      const descendantIds = getDescendantIds(categoryId);
      const toRemove = new Set([categoryId, ...descendantIds]);
      onChange(selectedCategories.filter(id => !toRemove.has(id)));
    } else {
      // Add this category
      onChange([...selectedCategories, categoryId]);
    }
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategories.includes(category.id);
    const count = counts?.[category.id];

    return (
      <div key={category.id}>
        <div 
          className={cn(
            "flex items-center gap-2 py-1.5 cursor-pointer group",
            level > 0 && "pl-4"
          )}
          style={{ paddingLeft: level > 0 ? `${level * 16}px` : undefined }}
        >
          {hasChildren && (
            <button
              type="button"
              onClick={() => toggleExpand(category.id)}
              className="p-0.5 rounded hover:bg-muted"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}

          <label className="flex items-center gap-2 flex-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggle(category.id)}
              className="rounded border-input h-4 w-4 text-primary focus:ring-primary"
            />
            <span className={cn(
              "text-sm transition-colors",
              isSelected ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}>
              {getCategoryName(category, language)}
            </span>
            {showCounts && count !== undefined && (
              <span className="text-xs text-muted-foreground">
                ({count})
              </span>
            )}
          </label>
        </div>

        {hasChildren && isExpanded && (
          <div className="animate-accordion-down">
            {category.subcategories!.map(sub => renderCategory(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-1", className)}>
      {categories.map(cat => renderCategory(cat))}
    </div>
  );
}
