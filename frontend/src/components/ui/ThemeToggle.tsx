/**
 * Theme Toggle — sun/moon icon button.
 * Uses next-themes to manage light/dark mode.
 * Persists choice in localStorage; falls back to system preference.
 */
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — render nothing until mounted
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={`w-10 h-10 md:w-11 md:h-11 ${className ?? ''}`} />
    );
  }

  const isDark = resolvedTheme === 'dark';
  const label = isDark
    ? language === 'ka' ? 'ნათელი რეჟიმი' : 'Light mode'
    : language === 'ka' ? 'მუქი რეჟიმი' : 'Dark mode';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={label}
          className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all ${className ?? ''}`}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
