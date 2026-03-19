import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  AlertTriangle,
  MessageSquare,
  FileText,
  LogOut,
  Shield,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/listings', icon: Package, label: 'Listings' },
  { href: '/admin/tools', icon: Shield, label: 'Tools' },
  { href: '/admin/reports', icon: AlertTriangle, label: 'Reports' },
  { href: '/admin/chats', icon: MessageSquare, label: 'Chats' },
  { href: '/admin/audit-log', icon: FileText, label: 'Audit Log' },
];

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { hasAdminAccess, role, loading: adminLoading } = useAdmin();
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = adminLoading || authLoading;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex">
        <div className="w-64 bg-card border-r p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        {/* Header with Admin Identity */}
        <div className="p-4 border-b">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </Link>
          
          {/* Admin Identity Indicator */}
          <div className="mt-3 p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {role?.charAt(0).toUpperCase()}{role?.slice(1) || 'Admin'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate" title={user?.email || ''}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          <Link to="/">
            <Button variant="outline" size="sm" className="w-full">
              Back to Site
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
