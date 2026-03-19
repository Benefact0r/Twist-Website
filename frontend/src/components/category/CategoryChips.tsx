import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories as defaultCategories, getCategoryName } from '@/data/categories';
import { Category } from '@/types';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryChipsProps {
  selectedCategory?: string;
  onSelect?: (categoryId: string) => void;
  className?: string;
  asLinks?: boolean;
  categories?: Category[];
}

export function CategoryChips({ 
  selectedCategory, 
  onSelect,
  className,
  asLinks = false,
  categories = defaultCategories
}: CategoryChipsProps) {
  const { language } = useLanguage();

  const renderChip = (category: Category) => {
    const isSelected = selectedCategory === category.id;
    const content = (
      <span className="whitespace-nowrap">
        {getCategoryName(category, language)}
      </span>
    );

    const chipClass = cn(
      "inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
      "text-sm font-medium",
      isSelected
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-card border-border hover:border-primary/50 hover:bg-muted"
    );

    if (asLinks) {
      return (
        <Link
          key={category.id}
          to={`/search?category=${category.id}`}
          className={chipClass}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={category.id}
        type="button"
        onClick={() => onSelect?.(category.id)}
        className={chipClass}
      >
        {content}
      </button>
    );
  };

  return (
    <ScrollArea className={cn("w-full whitespace-nowrap", className)}>
      <div className="flex gap-2 pb-2">
        {categories.map(renderChip)}
      </div>
      <ScrollBar orientation="horizontal" className="h-1.5" />
    </ScrollArea>
  );
}
