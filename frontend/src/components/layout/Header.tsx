import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Globe, User, LogOut, Heart, MessageCircle, Plus, Menu } from 'lucide-react';
import twistLogo from '@/assets/twist-logo.png';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useConversations } from '@/hooks/useConversations';
import { MegaMenu } from '@/components/navigation/MegaMenu';
import { MobileCategoryNav } from '@/components/navigation/MobileCategoryNav';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Pages that should show the category navigation
const PAGES_WITH_CATEGORIES = [
  '/',
  '/search',
  '/category',
  '/listing',
];

// Pages that should hide the category navigation
const PAGES_WITHOUT_CATEGORIES = [
  '/profile',
  '/sell',
  '/favorites',
  '/messages',
  '/settings',
  '/cart',
  '/checkout',
  '/auth',
  '/login',
  '/reset-password',
  '/seller-guide',
  '/shipping-info',
];

export function Header() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const { validFavoritesCount } = useFavorites();
  const { conversations } = useConversations();

  // Calculate unread message count
  const unreadCount = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  // Determine if categories should be shown based on current route
  const shouldShowCategories = () => {
    const currentPath = location.pathname;
    
    if (PAGES_WITHOUT_CATEGORIES.some(path => 
      currentPath === path || currentPath.startsWith(path + '/')
    )) {
      return false;
    }
    
    if (PAGES_WITH_CATEGORIES.some(path => 
      currentPath === path || currentPath.startsWith(path + '/')
    )) {
      return true;
    }
    
    return currentPath === '/';
  };

  const showCategories = shouldShowCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Preserve current category if on search page
      const searchParams = new URLSearchParams(location.search);
      const currentCategory = searchParams.get('category');
      const newParams = new URLSearchParams();
      newParams.set('q', searchQuery.trim());
      if (currentCategory) {
        newParams.set('category', currentCategory);
      }
      navigate(`/search?${newParams.toString()}`);
      setSearchQuery('');
    } else {
      navigate('/search');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ka' ? 'en' : 'ka');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile?.username?.[0]?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50 dark:bg-[linear-gradient(180deg,hsl(150_20%_5%/0.97),hsl(155_15%_6%/0.97))] dark:border-b-[rgba(255,255,255,0.04)]">
      {/* Main header */}
      <div className="container py-3 md:py-4">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img 
              src={twistLogo} 
              alt="Twist" 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder={t('nav.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-search-pill pl-14 pr-6 w-full"
              />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Globe className="h-4 w-4" />
              {language === 'ka' ? 'EN' : 'ქარ'}
            </button>

            {/* Favorites Link */}
            <Link
              to="/favorites"
              className="relative flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Heart className="h-5 w-5" />
              {validFavoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  {validFavoritesCount > 99 ? '99+' : validFavoritesCount}
                </span>
              )}
            </Link>

            {/* Notifications Bell */}
            <NotificationBell />

            {/* Messages Link */}
            <Link
              to="/messages"
              className="relative flex items-center justify-center w-11 h-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-11 h-11 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
                  <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5">
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2.5" />
                      {language === 'ka' ? 'პროფილი' : 'Profile'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5">
                    <Link to="/favorites" className="cursor-pointer">
                      <Heart className="h-4 w-4 mr-2.5" />
                      {language === 'ka' ? 'ფავორიტები' : 'Favorites'}
                      {validFavoritesCount > 0 && (
                        <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full font-medium">
                          {validFavoritesCount}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5">
                    <Link to="/messages" className="cursor-pointer">
                      <MessageCircle className="h-4 w-4 mr-2.5" />
                      {language === 'ka' ? 'შეტყობინებები' : 'Messages'}
                      {unreadCount > 0 && (
                        <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg px-3 py-2.5 cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2.5" />
                    {language === 'ka' ? 'გასვლა' : 'Log out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2"
              >
                {language === 'ka' ? 'შესვლა' : 'Log in'}
              </Link>
            )}

            {/* Primary Sell CTA */}
            <Button 
              size="default" 
              className="h-11 px-5 rounded-full font-semibold shadow-sm hover:shadow-md transition-all"
              asChild
            >
              <Link to="/sell">
                <Plus className="h-4 w-4 mr-1.5" />
                {language === 'ka' ? 'გაყიდვა' : 'Sell Now'}
              </Link>
            </Button>
          </div>

          {/* Mobile: Categories, Favorites, Notifications, Language */}
          <div className="md:hidden ml-auto flex items-center gap-1">
            {/* Mobile Categories Menu */}
            <MobileCategoryNav 
              trigger={
                <button className="flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                  <Menu className="h-5 w-5" />
                </button>
              }
            />

            {/* Mobile Favorites */}
            <Link
              to="/favorites"
              className="relative flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Heart className="h-5 w-5" />
              {validFavoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                  {validFavoritesCount > 99 ? '99+' : validFavoritesCount}
                </span>
              )}
            </Link>

            {/* Mobile Notifications */}
            <NotificationBell />

            {/* Mobile Theme Toggle */}
            <ThemeToggle />

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-muted text-sm font-medium"
            >
              {language === 'ka' ? 'EN' : 'ქარ'}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder={language === 'ka' ? 'ძიება...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-12 w-full rounded-full border border-border bg-muted/50 px-11 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background"
            />
          </div>
        </form>
      </div>

      {/* Mega Menu Categories - Desktop (Context-aware) */}
      {showCategories && <MegaMenu />}
    </header>
  );
}
