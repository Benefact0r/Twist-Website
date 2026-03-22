import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { request } from '@/lib/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type AdminListing = {
  id: string;
  title: string;
  price: string;
  category: string;
  condition: string;
  status: 'DRAFT' | 'ACTIVE' | 'SOLD' | 'ARCHIVED';
  createdAt: string;
  seller: {
    id: string;
    email: string;
    username: string | null;
  };
};

type ListingsResponse = {
  items: AdminListing[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

const STATUS_OPTIONS: AdminListing['status'][] = ['DRAFT', 'ACTIVE', 'SOLD', 'ARCHIVED'];

export default function AdminListings() {
  const [items, setItems] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, AdminListing['status']>>({});

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', String(page));
    params.set('pageSize', '20');
    return params.toString();
  }, [q, statusFilter, page]);

  const fetchListings = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await request<ListingsResponse>(`/admin/listings?${queryString}`);
      setItems(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(Math.max(1, data.totalPages));
      setStatusDrafts(
        Object.fromEntries(data.items.map((listing) => [listing.id, listing.status])) as Record<
          string,
          AdminListing['status']
        >
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [queryString]);

  const updateListing = async (id: string, newStatus: AdminListing['status']) => {
    setErrorMessage(null);
    setSavingId(id);
    try {
      await request<{ listing: AdminListing }>(`/admin/listings/${id}`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      await fetchListings();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setSavingId(null);
    }
  };

  const removeListing = async (id: string) => {
    const confirmed = window.confirm('Delete this listing? This action cannot be undone.');
    if (!confirmed) return;

    setErrorMessage(null);
    setSavingId(id);
    try {
      await request<void>(`/admin/listings/${id}`, { method: 'DELETE' });
      await fetchListings();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Listings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage platform listings and moderation.</p>
            <p className="text-xs text-muted-foreground mt-1">Total listings: {totalCount}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchListings} variant="outline">
              Refresh
            </Button>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-3 max-w-xl">
          <Input
            placeholder="Search by title..."
            value={q}
            onChange={(e) => {
              setPage(0);
              setQ(e.target.value);
            }}
          />
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setPage(0);
              setStatusFilter(e.target.value);
            }}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Listing</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Seller</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={6}>
                      Loading listings...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={6}>
                      No listings found.
                    </td>
                  </tr>
                ) : (
                  items.map((listing) => (
                    <tr key={listing.id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {listing.category} • {listing.condition}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        ₾ {listing.price}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{listing.seller.email}</p>
                        <p className="text-xs text-muted-foreground">{listing.seller.username || listing.seller.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="h-8 rounded-md border bg-background px-2 text-xs"
                          value={statusDrafts[listing.id] || listing.status}
                          onChange={(e) =>
                            setStatusDrafts((prev) => ({
                              ...prev,
                              [listing.id]: e.target.value as AdminListing['status'],
                            }))
                          }
                          disabled={savingId === listing.id}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            disabled={
                              savingId === listing.id || (statusDrafts[listing.id] || listing.status) === listing.status
                            }
                            onClick={() =>
                              updateListing(listing.id, statusDrafts[listing.id] || listing.status)
                            }
                          >
                            Save Status
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 text-xs"
                            disabled={savingId === listing.id}
                            onClick={() => removeListing(listing.id)}
                          >
                            Delete
                          </Button>
                        </div>
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
