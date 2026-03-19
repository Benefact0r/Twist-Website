import { useState } from 'react';
import { Bell, Check, CheckCheck, X, Package, MessageCircle, Heart, Truck, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDistanceToNow } from 'date-fns';
import { ka, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'item_sold':
    case 'item_reserved':
      return Package;
    case 'offer_received':
      return ShoppingCart;
    case 'delivery_update':
      return Truck;
    case 'buyer_message':
      return MessageCircle;
    case 'item_saved':
      return Heart;
    case 'purchase_confirmed':
      return Check;
    case 'new_order':
      return ShoppingCart;
    default:
      return Bell;
  }
};

const getNotificationLink = (notification: Notification): string => {
  if (notification.link_url) return notification.link_url;
  switch (notification.type) {
    case 'item_sold':
    case 'item_reserved':
    case 'purchase_confirmed':
    case 'new_order':
    case 'delivery_update':
      return '/profile?tab=orders';
    case 'offer_received':
    case 'buyer_message':
      return '/messages';
    case 'item_saved':
      return '/profile?tab=listings';
    default:
      return '/';
  }
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const { language } = useLanguage();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">
            {language === 'ka' ? 'შეტყობინებები' : 'Notifications'}
          </h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              <CheckCheck className="h-3 w-3 mr-1" />
              {language === 'ka' ? 'ყველას წაკითხვა' : 'Mark all read'}
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              {language === 'ka' ? 'იტვირთება...' : 'Loading...'}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground text-sm">
                {language === 'ka' ? 'შეტყობინებები არ არის' : 'No notifications yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const link = getNotificationLink(notification);
                
                return (
                  <Link
                    key={notification.id}
                    to={link}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-full shrink-0",
                      notification.read ? "bg-muted" : "bg-primary/10"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4",
                        notification.read ? "text-muted-foreground" : "text-primary"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm line-clamp-1",
                        !notification.read && "font-medium"
                      )}>
                        {language === 'ka' ? notification.title_ka : notification.title_en}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {language === 'ka' ? notification.message_ka : notification.message_en}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: language === 'ka' ? ka : enUS
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
            <Link to="/profile?tab=notifications" onClick={() => setOpen(false)}>
              {language === 'ka' ? 'ყველას ნახვა' : 'View all notifications'}
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
