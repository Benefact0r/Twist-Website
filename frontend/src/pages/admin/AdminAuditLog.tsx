import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { request } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';

type AuditLog = {
  id: string;
  actionType: string;
  entityType: string;
  entityId: string;
  details: any;
  createdAt: string;
  admin: {
    id: string;
    email: string;
  };
};

type AuditLogResponse = {
  items: AuditLog[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

export default function AdminAuditLog() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', '20');
    return params.toString();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await request<AuditLogResponse>(`/admin/audit-logs?${queryString}`);
      setItems(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(Math.max(1, data.totalPages));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [queryString]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-sm text-muted-foreground mt-1">Review actions performed by administrators.</p>
            <p className="text-xs text-muted-foreground mt-1">Total logs: {totalCount}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchLogs} variant="outline">
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
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Admin</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={5}>
                      Loading logs...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={5}>
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  items.map((log) => (
                    <tr key={log.id} className="border-t">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{log.admin.email}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{log.admin.id}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-xs whitespace-nowrap">
                        <span className="bg-secondary/50 px-2 py-1 rounded-md">{log.actionType}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-xs font-medium uppercase tracking-wider">{log.entityType}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{log.entityId}</p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <pre className="max-w-[200px] md:max-w-xs overflow-x-auto p-2 bg-muted/30 rounded-md text-[10px]">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
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
