import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { request } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';

type AdminReport = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  reportCategory: string;
  optionalDetails: string | null;
  priority: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  reporter: {
    id: string;
    email: string;
    username: string | null;
  };
};

type ReportsResponse = {
  items: AdminReport[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

const STATUS_OPTIONS: AdminReport['status'][] = ['OPEN', 'IN_REVIEW', 'RESOLVED', 'REJECTED'];

export default function AdminReports() {
  const [items, setItems] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, AdminReport['status']>>({});

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', String(page));
    params.set('pageSize', '20');
    return params.toString();
  }, [statusFilter, page]);

  const fetchReports = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await request<ReportsResponse>(`/admin/reports?${queryString}`);
      setItems(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(Math.max(1, data.totalPages));
      setStatusDrafts(
        Object.fromEntries(data.items.map((report) => [report.id, report.status])) as Record<
          string,
          AdminReport['status']
        >
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [queryString]);

  const updateReportStatus = async (id: string, newStatus: AdminReport['status']) => {
    setErrorMessage(null);
    setSavingId(id);
    try {
      await request<{ report: AdminReport }>(`/admin/reports/${id}`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      await fetchReports();
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
            <h1 className="text-3xl font-bold text-foreground">Admin Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">Review user reports and moderation tickets.</p>
            <p className="text-xs text-muted-foreground mt-1">Total reports: {totalCount}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchReports} variant="outline">
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
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium">Reporter</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={6}>
                      Loading reports...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={6}>
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  items.map((report) => (
                    <tr key={report.id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium text-xs font-mono">{report.targetType}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[120px] truncate" title={report.targetId}>
                          {report.targetId}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{report.reportCategory}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{report.reason}</p>
                        {report.optionalDetails && (
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">"{report.optionalDetails}"</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{report.reporter.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="h-8 rounded-md border bg-background px-2 text-xs"
                          value={statusDrafts[report.id] || report.status}
                          onChange={(e) =>
                            setStatusDrafts((prev) => ({
                              ...prev,
                              [report.id]: e.target.value as AdminReport['status'],
                            }))
                          }
                          disabled={savingId === report.id}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          disabled={
                            savingId === report.id || (statusDrafts[report.id] || report.status) === report.status
                          }
                          onClick={() =>
                            updateReportStatus(report.id, statusDrafts[report.id] || report.status)
                          }
                        >
                          Save Status
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
