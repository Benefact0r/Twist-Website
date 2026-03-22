import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { request } from '@/lib/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type AdminUser = {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  role: 'BUYER' | 'SELLER' | 'ADMIN' | 'COURIER';
  is_suspended: boolean;
  suspension_reason: string | null;
  created_at: string;
};

type UsersResponse = {
  items: AdminUser[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

const ROLE_OPTIONS: AdminUser['role'][] = ['BUYER', 'SELLER', 'ADMIN', 'COURIER'];

export default function AdminUsers() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roleDrafts, setRoleDrafts] = useState<Record<string, AdminUser['role']>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    role: 'BUYER' as AdminUser['role'],
    full_name: '',
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    params.set('page', String(page));
    params.set('pageSize', '20');
    return params.toString();
  }, [q, page]);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await request<UsersResponse>(`/admin/users?${queryString}`);
      setItems(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(Math.max(1, data.totalPages));
      setRoleDrafts(
        Object.fromEntries(data.items.map((user) => [user.id, user.role])) as Record<string, AdminUser['role']>,
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [queryString]);

  const updateUser = async (id: string, body: Record<string, unknown>) => {
    setErrorMessage(null);
    setSavingId(id);
    try {
      await request<{ user: AdminUser }>(`/admin/users/${id}`, {
        method: 'PATCH',
        body,
      });
      await fetchUsers();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setSavingId(null);
    }
  };

  const removeUser = async (id: string) => {
    const confirmed = window.confirm('Delete this user? This may fail if related records exist.');
    if (!confirmed) return;

    setErrorMessage(null);
    setSavingId(id);
    try {
      await request<void>(`/admin/users/${id}`, { method: 'DELETE' });
      await fetchUsers();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setSavingId(null);
    }
  };

  const createUser = async () => {
    if (!createForm.email.trim() || !createForm.password.trim()) {
      setErrorMessage('Email and password are required');
      return;
    }
    if (createForm.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters (API requirement).');
      return;
    }
    setErrorMessage(null);
    setCreating(true);
    try {
      await request<{ user: AdminUser }>(`/admin/users`, {
        method: 'POST',
        body: {
          email: createForm.email.trim().toLowerCase(),
          password: createForm.password,
          role: createForm.role,
          full_name: createForm.full_name.trim() || undefined,
        },
      });
      setCreateOpen(false);
      setCreateForm({ email: '', password: '', role: 'BUYER', full_name: '' });
      await fetchUsers();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Users</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage user roles, suspension, and account deletion.</p>
            <p className="text-xs text-muted-foreground mt-1">Total users: {totalCount}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setCreateOpen(true)}>Create user</Button>
            <Button onClick={fetchUsers} variant="outline">
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
            placeholder="Search by email, username, name, phone..."
            value={q}
            onChange={(e) => {
              setPage(0);
              setQ(e.target.value);
            }}
          />
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                      Loading users...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  items.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-3">
                        <p className="font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.full_name || user.username || user.id}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="h-9 rounded-md border bg-background px-2"
                          value={roleDrafts[user.id] || user.role}
                          onChange={(e) =>
                            setRoleDrafts((prev) => ({ ...prev, [user.id]: e.target.value as AdminUser['role'] }))
                          }
                          disabled={savingId === user.id}
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        {user.is_suspended ? (
                          <Badge variant="destructive">Suspended</Badge>
                        ) : (
                          <Badge variant="secondary">Active</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={savingId === user.id || (roleDrafts[user.id] || user.role) === user.role}
                            onClick={() => updateUser(user.id, { role: roleDrafts[user.id] || user.role })}
                          >
                            Save role
                          </Button>
                          <Button
                            size="sm"
                            variant={user.is_suspended ? 'secondary' : 'outline'}
                            disabled={savingId === user.id}
                            onClick={() =>
                              updateUser(user.id, {
                                is_suspended: !user.is_suspended,
                                suspension_reason: !user.is_suspended ? 'admin_action' : null,
                              })
                            }
                          >
                            {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={savingId === user.id}
                            onClick={() => removeUser(user.id)}
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="new-user-email">Email</Label>
              <Input
                id="new-user-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="new-user-password">Password</Label>
              <Input
                id="new-user-password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters (same as the API).</p>
            </div>
            <div>
              <Label htmlFor="new-user-role">Role</Label>
              <select
                id="new-user-role"
                className="h-10 w-full rounded-md border bg-background px-3"
                value={createForm.role}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value as AdminUser['role'] }))}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="new-user-fullname">Full name (optional)</Label>
              <Input
                id="new-user-fullname"
                value={createForm.full_name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, full_name: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={creating}>
                Cancel
              </Button>
              <Button onClick={createUser} disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
