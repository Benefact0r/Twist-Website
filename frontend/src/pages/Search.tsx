import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { ListingGrid } from '@/components/listing/ListingGrid';
import { SearchPagination } from '@/components/listing/SearchPagination';
import { categories, getCategoryById, isDescendantOf, getDescendantIds, getCategoryName } from '@/data/categories';
import { useListingsQuery, PAGE_SIZE_MOBILE, PAGE_SIZE_DESKTOP } from '@/hooks/useListingsQuery';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ListingCondition, Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
export default function Search() {
  const { t, language } = useLanguage();
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  
  // Responsive page size
  const pageSize = isMobile ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP;
  
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchParams.get('q') || '');
  
  const initialCategory = slug || searchParams.get('category') || '';
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [selectedConditions, setSelectedConditions] = useState<ListingCondition[]>([]);

  // Vinted-style: blank inputs + debounced apply to filtering state

  // Price range state
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null]);
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedApplyPrice = useCallback((min: string, max: string) => {
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => {
      const parse = (v: string): number | null => {
        if (v === '') return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
      };

      setPriceRange([parse(min), parse(max)]);
    }, 300);
  }, []);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMinPriceInput(value);
      debouncedApplyPrice(value, maxPriceInput);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMaxPriceInput(value);
      debouncedApplyPrice(minPriceInput, value);
    }
  };

  const [sortBy, setSortBy] = useState('relevance');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Update selected categories and search query when URL changes
  useEffect(() => {
    const cat = slug || searchParams.get('category');
    const q = searchParams.get('q');

    setSelectedCategories((prev) => {
      if (!cat) return prev.length ? [] : prev;
      return prev.length === 1 && prev[0] === cat ? prev : [cat];
    });

    setDebouncedSearchQuery(q || '');
  }, [searchParams, slug]);

  const conditions: { value: ListingCondition; label: string }[] = [
    { value: 'new', label: t('condition.new') },
    { value: 'like-new', label: t('condition.likeNew') },
    { value: 'good', label: t('condition.good') },
    { value: 'fair', label: t('condition.fair') },
  ];

  const sortOptions = [
    { value: 'relevance', label: t('search.sort.relevance') },
    { value: 'newest', label: t('search.sort.newest') },
    { value: 'price-low', label: t('search.sort.priceLow') },
    { value: 'price-high', label: t('search.sort.priceHigh') },
    { value: 'popular', label: t('search.sort.popular') },
  ];

  // Fetch real listings from backend API via cached query hook
  const { 
    listings: apiListings, 
    loading: listingsLoading, 
    totalPages,
    isFetching,
  } = useListingsQuery({
    categoryId: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    searchQuery: debouncedSearchQuery || undefined,
    conditions: selectedConditions.length > 0 ? selectedConditions : undefined,
    priceRange: priceRange[0] !== null || priceRange[1] !== null ? priceRange : undefined,
    sortBy,
    page: currentPage,
    pageSize,
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategories, selectedConditions, priceRange, sortBy]);

  // Apply any additional client-side filters for multiple category selection
  const filteredListings = useMemo(() => {
    let results = [...apiListings];

    // Handle multiple category selection (beyond what the hook handles)
    if (selectedCategories.length > 1) {
      results = results.filter((l) => {
        return selectedCategories.some((catId) => {
          if (l.categoryId === catId) return true;
          return isDescendantOf(l.categoryId, catId);
        });
      });
    }

    // Sort for popular (hook doesn't handle this)
    if (sortBy === 'popular') {
      results.sort((a, b) => b.favoriteCount - a.favoriteCount);
    }

    return results;
  }, [apiListings, selectedCategories, sortBy]);

  const activeFiltersCount = selectedCategories.length + selectedConditions.length + (priceRange[0] !== null || priceRange[1] !== null ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceRange([null, null]);
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  const handleCategoryToggle = (catId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, catId]);
    } else {
      // Remove category and all its descendants
      const descendants = getDescendantIds(catId);
      const toRemove = new Set([catId, ...descendants]);
      setSelectedCategories(selectedCategories.filter((c) => !toRemove.has(c)));
    }
  };

  const toggleExpand = (catId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const renderCategoryTree = (cat: Category, level: number = 0) => {
    const hasChildren = cat.subcategories && cat.subcategories.length > 0;
    const isExpanded = expandedCategories.has(cat.id);
    const isSelected = selectedCategories.includes(cat.id);
    const catName = getCategoryName(cat, language);

    return (
      <div key={cat.id}>
        <div 
          className="flex items-center gap-2 py-2 group"
          style={{ paddingLeft: level > 0 ? `${level * 16}px` : undefined }}
        >
          {/* Chevron for expandable categories */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleExpand(cat.id)}
              className="p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-90"
              )} />
            </button>
          ) : (
            <span className="w-5" />
          )}
          
          {/* Checkbox */}
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={(e) => handleCategoryToggle(cat.id, e.target.checked)} 
            className="rounded border-border h-4 w-4 text-primary focus:ring-primary cursor-pointer"
          />
          
          {/* Label */}
          <span 
            className={cn(
              "text-sm cursor-pointer select-none",
              isSelected ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}
            onClick={() => handleCategoryToggle(cat.id, !isSelected)}
          >
            {catName}
          </span>
        </div>
        
        {/* Subcategories */}
        {hasChildren && isExpanded && (
          <div className="animate-accordion-down">
            {cat.subcategories!.map(sub => renderCategoryTree(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };
  return (
    <Layout>
      <div className="container py-4 md:py-8">

        {/* Mobile top bar with filter + sort */}
        <div className="flex items-center gap-2 mb-4 md:hidden">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(true)} 
            className="flex-1 h-12 rounded-xl justify-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{t('search.filters')}</span>
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="ml-1 h-5 min-w-5 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          <div className="relative">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="h-12 pl-4 pr-10 rounded-xl border border-input bg-background text-sm appearance-none cursor-pointer hover:bg-accent transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
          </div>
        </div>

        {/* Desktop top bar */}
        <div className="hidden md:flex gap-4 mb-6">
          <div className="flex gap-2 ml-auto">
            <div className="relative">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="h-11 pl-4 pr-10 rounded-full border border-input bg-background text-sm appearance-none cursor-pointer hover:bg-accent transition-colors"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results header with count - desktop only */}
        <div className="hidden md:flex items-center justify-between mb-6">
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
              {t('search.clearAll')}
            </Button>
          )}
          <p className="text-sm text-muted-foreground ml-auto">
            {t('search.itemsFound', { count: filteredListings.length })}
            {debouncedSearchQuery && ` ${t('search.for', { query: debouncedSearchQuery })}`}
          </p>
        </div>

        {/* Mobile results count */}
        <p className="text-sm text-muted-foreground mb-4 md:hidden">
          {t('search.itemsFound', { count: filteredListings.length })}
          {debouncedSearchQuery && ` ${t('search.for', { query: debouncedSearchQuery })}`}
        </p>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-32 space-y-6">
              {/* Filters Heading */}
              <h2 className="text-2xl font-bold text-foreground">{t('search.filters')}</h2>

              {/* Category Section */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">{t('search.category')}</h3>
                <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
                  {categories.map((cat) => renderCategoryTree(cat))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <h3 className="text-sm font-medium mb-3">{t('search.condition')}</h3>
                <div className="space-y-2">
                  {conditions.map((cond) => (
                    <label key={cond.value} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedConditions.includes(cond.value)} 
                        onChange={(e) => { 
                          if (e.target.checked) { 
                            setSelectedConditions([...selectedConditions, cond.value]); 
                          } else { 
                            setSelectedConditions(selectedConditions.filter((c) => c !== cond.value)); 
                          } 
                        }} 
                        className="rounded border-input h-4 w-4" 
                      />
                      <span className="text-sm">{cond.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-sm font-medium mb-3">{t('search.price')}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center w-24 border border-input rounded-lg bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                    <span className="pl-3 text-muted-foreground text-sm">₾</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\\.?[0-9]*"
                      placeholder={t('search.min')}
                      value={minPriceInput}
                      onChange={handleMinPriceChange}
                      className="w-full h-10 px-2 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                      aria-label={t('search.min')}
                    />
                  </div>
                  <span className="text-muted-foreground">—</span>
                  <div className="flex items-center w-24 border border-input rounded-lg bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                    <span className="pl-3 text-muted-foreground text-sm">₾</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\\.?[0-9]*"
                      placeholder={t('search.max')}
                      value={maxPriceInput}
                      onChange={handleMaxPriceChange}
                      className="w-full h-10 px-2 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                      aria-label={t('search.max')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Active condition filters only (categories are shown in sidebar) */}
            {selectedConditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedConditions.map((cond) => (
                  <Badge 
                    key={cond} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-destructive/10" 
                    onClick={() => setSelectedConditions(selectedConditions.filter((c) => c !== cond))}
                  >
                    {conditions.find((c) => c.value === cond)?.label}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            <ListingGrid 
              listings={filteredListings} 
              loading={listingsLoading || isFetching}
              skeletonCount={pageSize}
            />
            
            {/* Pagination */}
            <SearchPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Mobile Filters Sheet - Full screen overlay */}
        <div className={cn(
          "fixed inset-0 z-50 bg-background md:hidden transition-transform duration-300 ease-out flex flex-col", 
          showFilters ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background shrink-0">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowFilters(false)}
              className="h-10 w-10"
            >
              <X className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">{t('search.filters')}</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-primary font-medium"
            >
              {t('search.clearAll')}
            </Button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pb-24 scrollbar-thin">
            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((catId) => {
                    const cat = getCategoryById(catId);
                    return cat ? (
                      <Badge 
                        key={catId} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-destructive/10 pl-2 pr-1 py-1"
                        onClick={() => handleCategoryToggle(catId, false)}
                      >
                        {getCategoryName(cat, language)}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ) : null;
                  })}
                  {selectedConditions.map((cond) => (
                    <Badge 
                      key={cond} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-destructive/10 pl-2 pr-1 py-1"
                      onClick={() => setSelectedConditions(selectedConditions.filter((c) => c !== cond))}
                    >
                      {conditions.find((c) => c.value === cond)?.label}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {(priceRange[0] !== null || priceRange[1] !== null) && (
                    <Badge 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-destructive/10 pl-2 pr-1 py-1"
                      onClick={() => {
                        setPriceRange([null, null]);
                        setMinPriceInput('');
                        setMaxPriceInput('');
                      }}
                    >
                      ₾{priceRange[0] ?? '0'} - ₾{priceRange[1] ?? '∞'}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Category Section */}
            <div className="px-4 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-foreground mb-3">{t('search.category')}</h3>
              <div className="space-y-0.5">
                {categories.map((cat) => renderCategoryTree(cat))}
              </div>
            </div>

            {/* Price Section */}
            <div className="px-4 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-foreground mb-3">{t('search.price')}</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center border border-input rounded-xl bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                  <span className="pl-3 text-muted-foreground text-sm font-medium">₾</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\\.?[0-9]*"
                    placeholder={t('search.min')}
                    value={minPriceInput}
                    onChange={handleMinPriceChange}
                    className="w-full h-12 px-2 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    aria-label={t('search.min')}
                  />
                </div>
                <span className="text-muted-foreground font-medium">—</span>
                <div className="flex-1 flex items-center border border-input rounded-xl bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                  <span className="pl-3 text-muted-foreground text-sm font-medium">₾</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\\.?[0-9]*"
                    placeholder={t('search.max')}
                    value={maxPriceInput}
                    onChange={handleMaxPriceChange}
                    className="w-full h-12 px-2 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    aria-label={t('search.max')}
                  />
                </div>
              </div>
            </div>

            {/* Condition Section */}
            <div className="px-4 py-4 border-b border-border">
              <h3 className="text-base font-semibold text-foreground mb-3">{t('search.condition')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {conditions.map((cond) => {
                  const isChecked = selectedConditions.includes(cond.value);
                  return (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedConditions(selectedConditions.filter((c) => c !== cond.value));
                        } else {
                          setSelectedConditions([...selectedConditions, cond.value]);
                        }
                      }}
                      className={cn(
                        "py-3 px-4 rounded-xl text-sm font-medium transition-all border",
                        isChecked 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-background text-foreground border-input hover:border-primary/50"
                      )}
                    >
                      {cond.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Section */}
            <div className="px-4 py-4">
              <h3 className="text-base font-semibold text-foreground mb-3">{language === 'ka' ? 'დალაგება' : 'Sort by'}</h3>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortBy(option.value)}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl text-sm text-left transition-all border",
                      sortBy === option.value 
                        ? "bg-primary/10 text-primary border-primary/30 font-medium" 
                        : "bg-background text-foreground border-input hover:border-primary/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed bottom button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border safe-area-inset-bottom">
            <Button 
              className="w-full h-14 text-base font-semibold rounded-xl" 
              onClick={() => setShowFilters(false)}
            >
              {t('search.showResults', { count: filteredListings.length })}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
