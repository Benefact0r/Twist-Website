import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { request } from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, AlertTriangle, Layers, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type StatsResponse = {
  totalUsers: number;
  activeListings: number;
  soldListings: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  openReports: number;
  recentUsers: { id: string; email: string; createdAt: string; role: string }[];
  recentListings: { id: string; title: string; price: number; createdAt: string; status: string }[];
  recentOrders: { id: string; itemTitle: string; totalAmount: string; status: string; createdAt: string }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await request<StatsResponse>('/admin/stats');
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-muted-foreground">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="p-6 text-destructive">Error: {error || 'Failed to load stats'}</div>
      </AdminLayout>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { title: 'Active Listings', value: stats.activeListings, icon: Package, color: 'text-green-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-purple-500' },
    { title: 'Completed Orders', value: stats.completedOrders, icon: Layers, color: 'text-indigo-500' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Package, color: 'text-orange-500' },
    { title: 'Open Reports', value: stats.openReports, icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">High-level insights into your marketplace.</p>
        </div>

        {/* STATS GRID */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Recent Orders */}
          <Card className="col-span-1 border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent orders</p>
              ) : (
                <ul className="space-y-4">
                  {stats.recentOrders.map(order => (
                    <li key={order.id} className="flex justify-between items-start text-sm border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium line-clamp-1">{order.itemTitle}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">₾{Number(order.totalAmount).toFixed(2)}</p>
                        <Badge variant="outline" className="text-[10px] uppercase mt-1 px-1.5 h-4 leading-none">
                          {order.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent Listings */}
          <Card className="col-span-1 border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Recent Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentListings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent listings</p>
              ) : (
                <ul className="space-y-4">
                  {stats.recentListings.map(listing => (
                    <li key={listing.id} className="flex justify-between items-start text-sm border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(listing.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₾{Number(listing.price).toFixed(2)}</p>
                        <Badge variant="secondary" className="text-[10px] mt-1 h-4 px-1.5 leading-none">
                          {listing.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card className="col-span-1 border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Recent Signups</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent users</p>
              ) : (
                <ul className="space-y-4">
                  {stats.recentUsers.map(u => (
                    <li key={u.id} className="flex justify-between items-start text-sm border-b pb-2 last:border-0 last:pb-0">
                      <div className="truncate pr-2">
                        <p className="font-medium truncate">{u.email}</p>
                        <p className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={u.role === 'ADMIN' ? 'default' : 'outline'} className="text-[10px] h-4 leading-none px-1.5 shrink-0">
                        {u.role}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
}
