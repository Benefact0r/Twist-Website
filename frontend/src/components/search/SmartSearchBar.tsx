import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Clock, Sparkles, Tag, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { request } from '@/lib/apiClient';

interface SearchSuggestion {
  type: 'query' | 'product' | 'brand' | 'category' | 'recent' | 'trending';
  text: string;
  count?: number;
  category?: string;
  brand?: string;
  image?: string;
  id?: string;
  price?: number;
}

type SearchApiListing = {
  id: string;
  title: string;
  category: string;
  price: number;
  images?: string[] | null;
};

interface SmartSearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  compact?: boolean;
}

export const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  className,
  placeholder,
  autoFocus = false,
  onSearch,
  compact = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<SearchSuggestion[]>([]);
  const [aiInsights, setAiInsights] = useState<{
    didYouMean?: string;
    suggestedFilters?: string[];
  } | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const trendingKey = user ? `twist_trending_searches_${user.id}` : 'twist_trending_searches_guest';

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('twist_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch {
        setRecentSearches([]);
      }
    }
    loadTrendingSearches();
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadTrendingSearches = async () => {
    try {
      const raw = localStorage.getItem(trendingKey);
      const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      const sorted = Object.entries(parsed)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([text, count]) => ({ type: 'trending' as const, text, count }));
      setTrendingSearches(sorted);
    } catch (error) {
      if (import.meta.env.DEV) console.log('Error loading trending searches:', error);
    }
  };

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setAiInsights(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await request<{
        items: SearchApiListing[];
      }>(`/listings/search?q=${encodeURIComponent(searchQuery)}&page=0&pageSize=8`, {
        auth: false,
      });

      const products = (data.items || []).map((item) => ({
        type: 'product' as const,
        text: item.title,
        category: item.category,
        image: item.images?.[0],
        id: item.id,
        price: item.price,
      }));

      const categoriesMap = new Map<string, number>();
      for (const item of data.items || []) {
        if (!item.category) continue;
        categoriesMap.set(item.category, (categoriesMap.get(item.category) || 0) + 1);
      }
      const categories = Array.from(categoriesMap.entries()).map(([name, count]) => ({
        type: 'category' as const,
        text: name,
        count,
        id: name,
      }));

      const querySuggestions = recentSearches
        .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)
        .map((s) => ({ type: 'query' as const, text: s }));

      const combined: SearchSuggestion[] = [...querySuggestions, ...products, ...categories];
      setSuggestions(combined.slice(0, 10));

      const closeMatch = products.find(
        (p) => p.text.toLowerCase().startsWith(searchQuery.toLowerCase()) && p.text.toLowerCase() !== searchQuery.toLowerCase(),
      );
      setAiInsights(closeMatch ? { didYouMean: closeMatch.text } : null);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [recentSearches]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query);
        setShowSuggestions(true);
      } else if (query.length === 0) {
        setSuggestions([]);
        setAiInsights(null);
      }
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('twist_recent_searches', JSON.stringify(updated));
    
    // Persist lightweight trending stats locally.
    try {
      const raw = localStorage.getItem(trendingKey);
      const parsed = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      parsed[searchQuery] = (parsed[searchQuery] || 0) + 1;
      localStorage.setItem(trendingKey, JSON.stringify(parsed));
      loadTrendingSearches();
    } catch (error) {
      if (import.meta.env.DEV) console.log('Error saving trending search:', error);
    }
    
    // Navigate to search results
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setAiInsights(null);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeRecentSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('twist_recent_searches', JSON.stringify(updated));
  };

  const handleProductClick = (productId: string) => {
    navigate(`/listing/${productId}`);
    setShowSuggestions(false);
  };

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/search?category=${categorySlug}`);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={cn("text-muted-foreground", compact ? "h-4 w-4" : "h-5 w-5")} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder || t('search.placeholder') || "Search for items, brands, or categories..."}
          className={cn(
            "w-full bg-background border border-input rounded-full focus:border-border focus:ring-2 focus:ring-border/20 focus:outline-none transition-all duration-200",
            compact ? "pl-10 pr-10 py-2.5 text-sm" : "pl-12 pr-12 py-4 text-base",
            "hover:border-muted-foreground/50"
          )}
          autoComplete="off"
          spellCheck="false"
          autoFocus={autoFocus}
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className={cn(
              "absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            )}
          >
            <X className={compact ? "h-4 w-4" : "h-5 w-5"} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          
          {/* AI "Did you mean" correction */}
          {aiInsights?.didYouMean && query.length >= 2 && (
            <div className="px-4 py-3 bg-primary/5 border-b border-border">
              <button
                onClick={() => {
                  setQuery(aiInsights.didYouMean!);
                  handleSearch(aiInsights.didYouMean!);
                }}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Sparkles className="h-4 w-4" />
                Did you mean: <span className="font-medium">{aiInsights.didYouMean}</span>?
              </button>
            </div>
          )}

          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="border-b border-border">
              <div className="px-4 py-3 text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {t('search.recent') || 'Recent Searches'}
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full px-4 py-3 text-left hover:bg-accent flex items-center justify-between group"
                >
                  <span className="text-foreground">{search}</span>
                  <button
                    onClick={(e) => removeRecentSearch(search, e)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          {query.length === 0 && trendingSearches.length > 0 && (
            <div className="border-b border-border">
              <div className="px-4 py-3 text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                {t('search.trending') || 'Trending Now'}
              </div>
              {trendingSearches.slice(0, 6).map((trend, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(trend.text)}
                  className="w-full px-4 py-3 text-left hover:bg-accent flex items-center justify-between"
                >
                  <span className="text-foreground">{trend.text}</span>
                  {trend.count && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {trend.count}+
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Search Suggestions */}
          {query.length >= 2 && (
            <>
              {/* Loading State */}
              {isLoading && (
                <div className="px-4 py-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Finding suggestions...</p>
                </div>
              )}

              {/* Suggestions List */}
              {!isLoading && suggestions.length > 0 && (
                <div className="max-h-[400px] overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${index}`}
                      onClick={() => {
                        if (suggestion.type === 'product' && suggestion.id) {
                          handleProductClick(suggestion.id);
                        } else if (suggestion.type === 'category' && suggestion.id) {
                          handleCategoryClick(suggestion.id);
                        } else {
                          handleSearch(suggestion.text);
                        }
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center border-b border-border/50 last:border-0 group"
                    >
                      {/* Icon based on type */}
                      <div className="mr-3 flex-shrink-0">
                        {suggestion.type === 'product' && (
                          <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                            {suggestion.image ? (
                              <img src={suggestion.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                👕
                              </div>
                            )}
                          </div>
                        )}
                        {suggestion.type === 'brand' && (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Store className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        {suggestion.type === 'category' && (
                          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                            <Tag className="h-5 w-5 text-secondary-foreground" />
                          </div>
                        )}
                        {(suggestion.type === 'query' || suggestion.type === 'trending') && (
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Search className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Suggestion Content */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground group-hover:text-primary truncate">
                          {suggestion.text}
                          {suggestion.brand && suggestion.type === 'product' && (
                            <span className="ml-2 text-sm text-muted-foreground">by {suggestion.brand}</span>
                          )}
                        </div>
                        
                        {suggestion.category && suggestion.type === 'product' && (
                          <div className="text-sm text-muted-foreground mt-0.5">
                            in <span className="text-primary">{suggestion.category}</span>
                            {suggestion.price && (
                              <span className="ml-2">• ₾{suggestion.price}</span>
                            )}
                          </div>
                        )}
                        
                        {suggestion.count !== undefined && suggestion.type !== 'product' && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {suggestion.count} items
                          </div>
                        )}
                      </div>

                      {/* Quick Action */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-primary ml-2">
                        →
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && suggestions.length === 0 && query.length >= 2 && (
                <div className="px-4 py-8 text-center">
                  <div className="text-muted-foreground mb-2">🔍</div>
                  <p className="text-foreground">No matches found for "{query}"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try different keywords or check spelling
                  </p>
                </div>
              )}
            </>
          )}

          {/* Quick Search Tips */}
          <div className="px-4 py-3 bg-muted/50 border-t border-border">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              <span><span className="font-medium">Pro Tip:</span> Try searching by brand, color, or style</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearchBar;
