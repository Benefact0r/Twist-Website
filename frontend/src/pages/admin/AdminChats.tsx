import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { request } from '@/lib/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type AdminTicket = {
  id: string;
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  relatedType: string | null;
  relatedId: string | null;
  internalNotes: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    username: string | null;
  };
};

type TicketsResponse = {
  items: AdminTicket[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

const STATUS_OPTIONS: AdminTicket['status'][] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export default function AdminChats() {
  const [items, setItems] = useState<AdminTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Detail Modal State
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [savingTarget, setSavingTarget] = useState<string | null>(null);
  const [ticketNotes, setTicketNotes] = useState('');
  const [ticketStatus, setTicketStatus] = useState<AdminTicket['status']>('OPEN');

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', String(page));
    params.set('pageSize', '20');
    return params.toString();
  }, [statusFilter, page]);

  const fetchTickets = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await request<TicketsResponse>(`/admin/tickets?${queryString}`);
      setItems(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(Math.max(1, data.totalPages));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [queryString]);

  const openTicket = (ticket: AdminTicket) => {
    setSelectedTicket(ticket);
    setTicketNotes(ticket.internalNotes || '');
    setTicketStatus(ticket.status);
  };

  const saveTicketUpdates = async () => {
    if (!selectedTicket) return;
    setSavingTarget('ticket_modal');
    setErrorMessage(null);
    try {
      await request<{ ticket: AdminTicket }>(`/admin/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        body: { status: ticketStatus, internalNotes: ticketNotes },
      });
      setSelectedTicket(null);
      await fetchTickets();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update ticket');
    } finally {
      setSavingTarget(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Chats & Tickets</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage user support tickets and messaging.</p>
            <p className="text-xs text-muted-foreground mt-1">Total tickets: {totalCount}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchTickets} variant="outline">
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
                  <th className="px-4 py-3 font-medium">Ticket / Subject</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Related Entity</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={6}>
                      Loading tickets...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground text-center" colSpan={6}>
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  items.map((ticket) => (
                    <tr key={ticket.id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium line-clamp-1">{ticket.subject}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1" title={ticket.description}>
                          {ticket.description}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{ticket.user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={ticket.status === 'OPEN' ? 'destructive' : ticket.status === 'RESOLVED' ? 'default' : 'secondary'}>
                          {ticket.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {ticket.relatedType ? (
                          <span className="font-mono">
                            {ticket.relatedType}: {ticket.relatedId}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => openTicket(ticket)}>
                          View & Edit
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

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        {selectedTicket && (
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>View Ticket: {selectedTicket.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm font-medium mb-1">Description:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {selectedTicket.relatedType && (
                <div className="text-sm">
                  <span className="font-medium">Related {selectedTicket.relatedType}:</span>{' '}
                  <span className="font-mono text-muted-foreground">{selectedTicket.relatedId}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select
                    className="h-10 w-full rounded-md border bg-background px-3"
                    value={ticketStatus}
                    onChange={(e) => setTicketStatus(e.target.value as AdminTicket['status'])}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Internal Admin Notes</Label>
                <Textarea
                  placeholder="Notes hidden from users..."
                  value={ticketNotes}
                  onChange={(e) => setTicketNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTicket(null)} disabled={savingTarget === 'ticket_modal'}>
                Cancel
              </Button>
              <Button onClick={saveTicketUpdates} disabled={savingTarget === 'ticket_modal'}>
                {savingTarget === 'ticket_modal' ? 'Saving...' : 'Save Updates'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AdminLayout>
  );
}
