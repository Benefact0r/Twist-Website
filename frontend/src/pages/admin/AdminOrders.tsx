import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { request } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';

const ORDER_STATUSES = [
  'created',
  'awaiting payment',
  'paid',
  'awaiting shipment',
  'in delivery',
  'delivered',
  'completed',
  'cancelled',
  'refunded',
  'disputed',
];
import { request } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';

type AdminOrder = {
  id: string;
  itemTitle: string;
  itemPrice: string;
  totalAmount: string;
  status: string;
  shippingFullName: string;
  shippingCity: string;
  createdAt: string;
};

type OrdersResponse = {
  items: AdminOrder[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

export default function AdminOrders() {
  const [items, setItems] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, string>>({});

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', String(page));
    params.set('pageSize', '20');
    return params.toString();
  }, [statusFilter, page]);

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await request<OrdersResponse>(`/admin/orders?${queryString}`);
      setItems(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(Math.max(1, data.totalPages));
      setStatusDrafts(
        Object.fromEntries(data.items.map((order) => [order.id, order.status]))
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [queryString]);

  const updateOrder = async (id: string, newStatus: string) => {
    setErrorMessage(null);
    setSavingId(id);
    try {
      await request<{ order: AdminOrder }>(`/admin/orders/${id}`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      await fetchOrders();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">View platform transactions and order history.</p>
            <p className="text-xs text-muted-foreground mt-1">Total orders: {totalCount}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchOrders} variant="outline">
              Refresh
            </Button>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Total Amount</th>
                  <th className="px-4 py-3 font-medium">Shipping To</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={6}>
                      Loading orders...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={6}>
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  items.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium line-clamp-1">{order.itemTitle}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Price: ₾ {order.itemPrice}</p>
                      </td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        ₾ {order.totalAmount}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{order.shippingFullName}</p>
                        <p className="text-xs text-muted-foreground">{order.shippingCity}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <select
                          className="h-8 rounded-md border bg-background px-2 text-xs"
                          value={statusDrafts[order.id] || order.status}
                          onChange={(e) =>
                            setStatusDrafts((prev) => ({
                              ...prev,
                              [order.id]: e.target.value,
                            }))
                          }
                          disabled={savingId === order.id}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          disabled={
                            savingId === order.id || (statusDrafts[order.id] || order.status) === order.status
                          }
                          onClick={() => updateOrder(order.id, statusDrafts[order.id] || order.status)}
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" disabled={page <= 0 || loading} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            Previous
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {page + 1} / {totalPages}
          </p>
          <Button
            variant="outline"
            disabled={page + 1 >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
