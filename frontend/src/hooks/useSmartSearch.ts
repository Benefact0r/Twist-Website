import { useState, useCallback, useMemo } from 'react';
import { getAllListings } from '@/data/mockData';
import { Listing } from '@/types';

interface SearchFilters {
  categories?: string[];
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  priceRange?: [number, number];
  conditions?: string[];
  materials?: string[];
  delivery?: string[];
}

interface UseSmartSearchReturn {
  results: Listing[];
  isSearching: boolean;
  totalResults: number;
  search: (query: string, filters?: SearchFilters) => void;
  clearSearch: () => void;
}

// Simple fuzzy matching function
function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Direct match
  if (lowerText.includes(lowerQuery)) return true;
  
  // Fuzzy match - allow for typos
  if (lowerQuery.length >= 3) {
    // Check if most characters match in sequence
    let queryIndex = 0;
    for (const char of lowerText) {
      if (char === lowerQuery[queryIndex]) {
        queryIndex++;
        if (queryIndex === lowerQuery.length) return true;
      }
    }
  }
  
  return false;
}

// Common typo corrections
const typoCorrections: Record<string, string[]> = {
  'zara': ['zarra', 'zra', 'zaar'],
  'nike': ['nikee', 'nke', 'nyke'],
  'adidas': ['addidas', 'adiddas', 'adidass'],
  'h&m': ['hm', 'handm', 'h and m'],
  'gucci': ['guchi', 'guci', 'guccci'],
  'levi\'s': ['levis', 'levis', 'levies'],
  'dress': ['dres', 'drss', 'drees'],
  'jacket': ['jaket', 'jacet', 'jakcet'],
  'shoes': ['sheos', 'shoess', 'shose'],
};

function expandQuery(query: string): string[] {
  const queries = [query.toLowerCase()];
  
  // Check for typo corrections
  for (const [correct, typos] of Object.entries(typoCorrections)) {
    if (typos.some(typo => query.toLowerCase().includes(typo))) {
      queries.push(query.toLowerCase().replace(
        new RegExp(typos.join('|'), 'gi'),
        correct
      ));
    }
  }
  
  return [...new Set(queries)];
}

export function useSmartSearch(): UseSmartSearchReturn {
  const [results, setResults] = useState<Listing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const allListings = useMemo(() => getAllListings(), []);

  const search = useCallback((query: string, filters?: SearchFilters) => {
    setIsSearching(true);
    
    // Simulate async search (would be real API call in production)
    setTimeout(() => {
      let filtered = [...allListings];
      
      // Text search with fuzzy matching
      if (query && query.trim()) {
        const expandedQueries = expandQuery(query.trim());
        
        filtered = filtered.filter(listing => {
          return expandedQueries.some(q => 
            fuzzyMatch(listing.title, q) ||
            fuzzyMatch(listing.description, q) ||
            (listing.brand && fuzzyMatch(listing.brand, q)) ||
            listing.tags.some(tag => fuzzyMatch(tag, q))
          );
        });
        
        // Sort by relevance (exact matches first)
        filtered.sort((a, b) => {
          const aExact = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
          const bExact = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
          return bExact - aExact;
        });
      }
      
      // Apply filters
      if (filters) {
        // Brand filter
        if (filters.brands && filters.brands.length > 0) {
          filtered = filtered.filter(l => 
            l.brand && filters.brands!.some(b => 
              l.brand!.toLowerCase().includes(b.toLowerCase())
            )
          );
        }
        
        // Size filter
        if (filters.sizes && filters.sizes.length > 0) {
          filtered = filtered.filter(l => 
            l.size && filters.sizes!.includes(l.size)
          );
        }
        
        // Condition filter
        if (filters.conditions && filters.conditions.length > 0) {
          filtered = filtered.filter(l => 
            filters.conditions!.includes(l.condition)
          );
        }
        
        // Price range filter
        if (filters.priceRange) {
          filtered = filtered.filter(l => 
            l.price >= filters.priceRange![0] && l.price <= filters.priceRange![1]
          );
        }
        
        // Category filter
        if (filters.categories && filters.categories.length > 0) {
          filtered = filtered.filter(l => 
            filters.categories!.some(cat => l.categoryId.includes(cat))
          );
        }
      }
      
      setResults(filtered);
      setIsSearching(false);
    }, 100);
  }, [allListings]);

  const clearSearch = useCallback(() => {
    setResults([]);
  }, []);

  return {
    results,
    isSearching,
    totalResults: results.length,
    search,
    clearSearch,
  };
}

export default useSmartSearch;
