import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { request } from '@/lib/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

type PickupPoint = {
  id: string;
  name: string;
  address: string;
  workingHours: string | null;
  contactNumber: string | null;
  isActive: boolean;
};

type PlatformSetting = {
  id: string;
  key: string;
  value: string;
  type: string;
  description: string | null;
};

export default function AdminTools() {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal states
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [savingTarget, setSavingTarget] = useState<string | null>(null);

  // Form states
  const [pickupForm, setPickupForm] = useState<Partial<PickupPoint>>({});
  const [settingForm, setSettingForm] = useState<Partial<PlatformSetting>>({ type: 'string' });

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [ppRes, setRes] = await Promise.all([
        request<{ items: PickupPoint[] }>('/admin/pickup-points'),
        request<{ items: PlatformSetting[] }>('/admin/platform-settings'),
      ]);
      setPickupPoints(ppRes.items);
      setSettings(setRes.items);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load tools data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -- PICKUP POINTS --
  const openPickupModal = (point?: PickupPoint) => {
    setPickupForm(point || { isActive: true });
    setIsPickupModalOpen(true);
  };

  const savePickupPoint = async () => {
    if (!pickupForm.name || !pickupForm.address) {
      setErrorMessage('Name and address are required.');
      return;
    }
    setSavingTarget('pickup');
    try {
      if (pickupForm.id) {
        await request(`/admin/pickup-points/${pickupForm.id}`, { method: 'PATCH', body: pickupForm });
      } else {
        await request(`/admin/pickup-points`, { method: 'POST', body: pickupForm });
      }
      setIsPickupModalOpen(false);
      await fetchData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save pickup point');
    } finally {
      setSavingTarget(null);
    }
  };

  const togglePickupStatus = async (point: PickupPoint) => {
    try {
      await request(`/admin/pickup-points/${point.id}`, { method: 'PATCH', body: { isActive: !point.isActive } });
      await fetchData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to toggle status');
    }
  };

  // -- SETTINGS --
  const openSettingModal = (setting?: PlatformSetting) => {
    setSettingForm(setting || { type: 'string' });
    setIsSettingModalOpen(true);
  };

  const saveSetting = async () => {
    if (!settingForm.key || !settingForm.value) {
      setErrorMessage('Key and value are required.');
      return;
    }
    setSavingTarget('setting');
    try {
      await request(`/admin/platform-settings`, {
        method: 'POST',
        body: {
          key: settingForm.key,
          value: settingForm.value,
          type: settingForm.type,
          description: settingForm.description,
        },
      });
      setIsSettingModalOpen(false);
      await fetchData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save setting');
    } finally {
      setSavingTarget(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tools & Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage logistics pickup points and global platform settings.</p>
        </div>

        {errorMessage && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <Tabs defaultValue="logistics" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="logistics">Pickup Points</TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>

          {/* LOGISTICS TAB */}
          <TabsContent value="logistics" className="space-y-4 pt-4">
            <div className="flex justify-end">
              <Button onClick={() => openPickupModal()}>Add Pickup Point</Button>
            </div>
            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Address</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                  ) : pickupPoints.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center">No pickup points configured.</td></tr>
                  ) : (
                    pickupPoints.map(point => (
                      <tr key={point.id} className="border-t">
                        <td className="px-4 py-3 font-medium">{point.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{point.address}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {point.contactNumber || '-'} <br/>
                          <span className="text-xs">{point.workingHours || '-'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Switch
                            checked={point.isActive}
                            onCheckedChange={() => togglePickupStatus(point)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" onClick={() => openPickupModal(point)}>Edit</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="flex justify-end">
              <Button onClick={() => openSettingModal()}>Add Setting</Button>
            </div>
            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Key</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr>
                  ) : settings.length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-center">No platform settings configured.</td></tr>
                  ) : (
                    settings.map(setting => (
                      <tr key={setting.id} className="border-t">
                        <td className="px-4 py-3 font-mono font-medium">{setting.key}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground truncate max-w-[200px]" title={setting.value}>
                          {setting.value}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{setting.description || '-'}</td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" onClick={() => openSettingModal(setting)}>Edit</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* PICKUP POINT MODAL */}
      <Dialog open={isPickupModalOpen} onOpenChange={setIsPickupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pickupForm.id ? 'Edit Pickup Point' : 'Add Pickup Point'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={pickupForm.name || ''}
                onChange={e => setPickupForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Central Hub"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={pickupForm.address || ''}
                onChange={e => setPickupForm(p => ({ ...p, address: e.target.value }))}
                placeholder="123 Main St, City"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Working Hours</Label>
                <Input
                  value={pickupForm.workingHours || ''}
                  onChange={e => setPickupForm(p => ({ ...p, workingHours: e.target.value }))}
                  placeholder="Mon-Fri, 9AM-6PM"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input
                  value={pickupForm.contactNumber || ''}
                  onChange={e => setPickupForm(p => ({ ...p, contactNumber: e.target.value }))}
                  placeholder="+995 555 123 456"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="active-switch"
                checked={pickupForm.isActive}
                onCheckedChange={c => setPickupForm(p => ({ ...p, isActive: c }))}
              />
              <Label htmlFor="active-switch">Active (Visible to users)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPickupModalOpen(false)}>Cancel</Button>
            <Button onClick={savePickupPoint} disabled={savingTarget === 'pickup'}>
              {savingTarget === 'pickup' ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SETTINGS MODAL */}
      <Dialog open={isSettingModalOpen} onOpenChange={setIsSettingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{settingForm.id ? 'Edit Setting' : 'Add Platform Setting'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Key (Identifier)</Label>
              <Input
                value={settingForm.key || ''}
                onChange={e => setSettingForm(p => ({ ...p, key: e.target.value.toUpperCase().replace(/\s+/g, '_') }))}
                placeholder="MAINTENANCE_MODE"
                disabled={!!settingForm.id} // cannot edit key after creation easily
              />
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Textarea
                value={settingForm.value || ''}
                onChange={e => setSettingForm(p => ({ ...p, value: e.target.value }))}
                placeholder="true"
                className="font-mono text-sm min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={settingForm.description || ''}
                onChange={e => setSettingForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Toggles site maintenance curtain."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingModalOpen(false)}>Cancel</Button>
            <Button onClick={saveSetting} disabled={savingTarget === 'setting'}>
              {savingTarget === 'setting' ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
