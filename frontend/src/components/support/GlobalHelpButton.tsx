import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HelpPanel } from './HelpPanel';
import { useSupport } from '@/hooks/useSupport';
import { cn } from '@/lib/utils';

interface GlobalHelpButtonProps {
  className?: string;
}

export const GlobalHelpButton: React.FC<GlobalHelpButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useSupport();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide button when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Floating Help Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full shadow-lg transition-all duration-300 group',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0',
          className
        )}
        aria-label="დახმარება"
      >
        {/* Icon */}
        <HelpCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        
        {/* Tooltip on Hover (Desktop Only) */}
        <span className="hidden md:block absolute right-full mr-3 px-3 py-2 bg-popover text-popover-foreground text-sm font-medium rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          დახმარება & მხარდაჭერა
        </span>
      </Button>

      {/* Help Panel */}
      {isOpen && <HelpPanel onClose={() => setIsOpen(false)} />}
    </>
  );
};
