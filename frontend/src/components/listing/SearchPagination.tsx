import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SearchPagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className 
}: SearchPaginationProps) {
  const { language } = useLanguage();
  
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsisThreshold = 7;
    
    if (totalPages <= showEllipsisThreshold) {
      // Show all pages
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);
      
      if (currentPage > 2) {
        pages.push('ellipsis');
      }
      
      // Show pages around current
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visiblePages = getVisiblePages();

  return (
    <nav 
      role="navigation" 
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1 py-8", className)}
    >
      {/* Previous button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="gap-1 px-2 sm:px-3"
        aria-label={language === 'ka' ? 'წინა გვერდი' : 'Previous page'}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">
          {language === 'ka' ? 'წინა' : 'Previous'}
        </span>
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span 
                key={`ellipsis-${index}`} 
                className="w-9 h-9 flex items-center justify-center text-muted-foreground"
                aria-hidden
              >
                …
              </span>
            );
          }
          
          const isActive = page === currentPage;
          return (
            <Button
              key={page}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className={cn(
                "w-9 h-9 p-0 font-medium",
                isActive && "pointer-events-none"
              )}
              aria-label={`${language === 'ka' ? 'გვერდი' : 'Page'} ${page + 1}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page + 1}
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="gap-1 px-2 sm:px-3"
        aria-label={language === 'ka' ? 'შემდეგი გვერდი' : 'Next page'}
      >
        <span className="hidden sm:inline">
          {language === 'ka' ? 'შემდეგი' : 'Next'}
        </span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
