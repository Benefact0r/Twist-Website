import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterState {
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number | null, number | null];
  conditions: string[];
  materials: string[];
  delivery: string[];
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
  className?: string;
}

const colorOptions = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Brown', hex: '#A16207' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Beige', hex: '#D4B896' },
  { name: 'Navy', hex: '#1E3A5F' },
];

const brandOptions = [
  { name: 'Zara', count: 1245 },
  { name: 'H&M', count: 980 },
  { name: 'Nike', count: 1567 },
  { name: 'Adidas', count: 1234 },
  { name: 'Mango', count: 567 },
  { name: "Levi's", count: 890 },
  { name: 'Massimo Dutti', count: 345 },
  { name: 'Pull & Bear', count: 456 },
  { name: 'Bershka', count: 389 },
  { name: 'Reserved', count: 234 },
];

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40', '41', '42', '43', '44'];

const conditionOptions = [
  { value: 'new', label: 'New with tags' },
  { value: 'like-new', label: 'Like new' },
  { value: 'good', label: 'Very good' },
  { value: 'fair', label: 'Good' },
];

const materialOptions = ['Cotton', 'Polyester', 'Silk', 'Leather', 'Denim', 'Wool', 'Linen', 'Cashmere'];

const deliveryOptions = [
  { value: 'free', label: 'Free shipping' },
  { value: 'pickup', label: 'Pickup available' },
  { value: 'fast', label: 'Fast delivery (1-2 days)' },
];

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  initialFilters,
  className,
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: initialFilters?.categories || [],
    brands: initialFilters?.brands || [],
    sizes: initialFilters?.sizes || [],
    colors: initialFilters?.colors || [],
    priceRange: initialFilters?.priceRange || [null, null],
    conditions: initialFilters?.conditions || [],
    materials: initialFilters?.materials || [],
    delivery: initialFilters?.delivery || [],
  });

  // Vinted-style: local input state for instant typing, debounced filter updates
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local inputs with filter state on mount/external changes
  useEffect(() => {
    setMinPriceInput(filters.priceRange[0] !== null ? String(filters.priceRange[0]) : '');
    setMaxPriceInput(filters.priceRange[1] !== null ? String(filters.priceRange[1]) : '');
  }, []);

  const toggleFilter = <K extends keyof FilterState>(
    category: K,
    value: FilterState[K] extends string[] ? string : never
  ) => {
    setFilters(prev => {
      const current = prev[category] as string[];
      const newValue = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      
      const newFilters = { ...prev, [category]: newValue };
      onFiltersChange(newFilters);
      return newFilters;
    });
  };

  // Debounced price update (Vinted-style 300ms delay)
  const debouncedPriceUpdate = useCallback((min: string, max: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const minVal = min === '' ? null : parseFloat(min);
      const maxVal = max === '' ? null : parseFloat(max);
      const newFilters = { ...filters, priceRange: [minVal, maxVal] as [number | null, number | null] };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    }, 300);
  }, [filters, onFiltersChange]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty, numbers, and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMinPriceInput(value);
      debouncedPriceUpdate(value, maxPriceInput);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty, numbers, and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMaxPriceInput(value);
      debouncedPriceUpdate(minPriceInput, value);
    }
  };

  const handleSliderChange = (values: number[]) => {
    setMinPriceInput(String(values[0]));
    setMaxPriceInput(String(values[1]));
    const newFilters = { ...filters, priceRange: [values[0], values[1]] as [number | null, number | null] };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      brands: [],
      sizes: [],
      colors: [],
      priceRange: [null, null],
      conditions: [],
      materials: [],
      delivery: [],
    };
    setFilters(clearedFilters);
    setMinPriceInput('');
    setMaxPriceInput('');
    onFiltersChange(clearedFilters);
  };

  const activeFilterCount = 
    filters.brands.length + 
    filters.sizes.length + 
    filters.colors.length + 
    filters.conditions.length + 
    filters.materials.length + 
    filters.delivery.length +
    (filters.priceRange[0] !== null || filters.priceRange[1] !== null ? 1 : 0);

  return (
    <div className={cn("bg-card rounded-xl border border-border shadow-sm", className)}>
      {/* Filter Header */}
      <button
        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 rounded-t-xl transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium text-foreground">{t('search.filters')}</span>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearAllFilters();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Brands */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Brands</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brandOptions.map(brand => (
                  <label key={brand.name} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand.name)}
                      onChange={() => toggleFilter('brands', brand.name)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-muted-foreground group-hover:text-foreground">
                      {brand.name}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">({brand.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleFilter('sizes', size)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                      filters.sizes.includes(size)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input text-muted-foreground hover:border-primary hover:text-foreground"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range - Vinted Style */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Price</h4>
              <div className="space-y-4">
                <Slider
                  value={[
                    filters.priceRange[0] ?? 0,
                    filters.priceRange[1] ?? 5000
                  ]}
                  onValueChange={handleSliderChange}
                  max={5000}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center gap-2">
                  <div className="flex items-center flex-1 border border-input rounded-lg bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                    <span className="pl-3 text-muted-foreground text-sm">₾</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={handleMinPriceChange}
                      className="w-full h-9 px-2 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                    />
                  </div>
                  <span className="text-muted-foreground text-sm">to</span>
                  <div className="flex items-center flex-1 border border-input rounded-lg bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
                    <span className="pl-3 text-muted-foreground text-sm">₾</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={handleMaxPriceChange}
                      className="w-full h-9 px-2 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Colors</h4>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.name}
                    onClick={() => toggleFilter('colors', color.name)}
                    className={cn(
                      "relative p-0.5 rounded-full transition-all",
                      filters.colors.includes(color.name) 
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                        : "hover:ring-2 hover:ring-muted-foreground hover:ring-offset-1 hover:ring-offset-background"
                    )}
                    title={color.name}
                  >
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center",
                        color.name === 'White' && "border border-border"
                      )}
                      style={{ backgroundColor: color.hex }}
                    >
                      {filters.colors.includes(color.name) && (
                        <span className={cn(
                          "text-xs font-bold",
                          ['White', 'Yellow', 'Beige'].includes(color.name) ? "text-gray-800" : "text-white"
                        )}>
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
            {/* Condition */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Condition</h4>
              <div className="space-y-2">
                {conditionOptions.map(condition => (
                  <label key={condition.value} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.conditions.includes(condition.value)}
                      onChange={() => toggleFilter('conditions', condition.value)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-muted-foreground group-hover:text-foreground">
                      {condition.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Materials</h4>
              <div className="flex flex-wrap gap-2">
                {materialOptions.map(material => (
                  <button
                    key={material}
                    onClick={() => toggleFilter('materials', material)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-full border transition-colors",
                      filters.materials.includes(material)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input text-muted-foreground hover:border-primary hover:text-foreground"
                    )}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Delivery</h4>
              <div className="space-y-2">
                {deliveryOptions.map(option => (
                  <label key={option.value} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.delivery.includes(option.value)}
                      onChange={() => toggleFilter('delivery', option.value)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-muted-foreground group-hover:text-foreground">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-6 pt-4 border-t border-border flex justify-end">
            <Button
              onClick={() => setIsExpanded(false)}
              className="px-6"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
