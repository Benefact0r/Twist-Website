import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';

export function BottomNav() {
  const location = useLocation();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { conversations } = useConversations();

  const unreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const navItems = [
    { icon: Home, path: '/', labelKey: 'nav.home' },
    { icon: Search, path: '/search', labelKey: 'nav.search' },
    { icon: Plus, path: '/sell', labelKey: 'nav.sell', isCta: true },
    { icon: MessageCircle, path: '/messages', labelKey: 'nav.inbox', badge: unreadCount > 0 ? unreadCount : undefined },
    { icon: User, path: user ? '/profile' : '/auth', labelKey: 'nav.profile' },
  ];

  const labels = {
    'nav.home': language === 'ka' ? 'მთავარი' : 'Home',
    'nav.search': language === 'ka' ? 'ძიება' : 'Search',
    'nav.sell': language === 'ka' ? 'გაყიდვა' : 'Sell',
    'nav.inbox': language === 'ka' ? 'შეტყობინებები' : 'Inbox',
    'nav.profile': language === 'ka' ? 'პროფილი' : 'Profile',
  };

  return (
    <nav className="bottom-nav md:hidden" aria-label={language === 'ka' ? 'ქვედა ნავიგაცია' : 'Bottom navigation'}>
      <div className="grid grid-cols-5 items-end px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCta) {
            return (
              <div key={item.path} className="flex items-center justify-center">
                <Link
                  to={item.path}
                  className="flex flex-col items-center justify-center relative -top-5 w-full"
                >
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center fab-shadow">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-medium text-primary mt-1">
                    {labels[item.labelKey as keyof typeof labels]}
                  </span>
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 h-4 w-4 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn("text-[10px]", isActive ? "font-semibold" : "font-medium")}>
                {labels[item.labelKey as keyof typeof labels]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
