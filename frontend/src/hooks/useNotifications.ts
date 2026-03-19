import { useState, useEffect, useCallback } from 'react';
import { createRealtimeSocket, request } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title_ka: string;
  title_en: string;
  message_ka: string;
  message_en: string;
  link_url: string | null;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const { items: data } = await request<{ items: any[] }>('/notifications');

      const mapped: Notification[] = (data || []).map((n: any) => ({
        id: n.id,
        user_id: n.user_id,
        type: n.type,
        title_ka: n.title_ka,
        title_en: n.title_en,
        message_ka: n.message_ka,
        message_en: n.message_en,
        link_url: n.link_url,
        data: n.data,
        read: !!n.read,
        created_at: n.created_at,
      }));

      setNotifications(mapped);
      setUnreadCount(mapped.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const socket = createRealtimeSocket((payload) => {
      if (payload?.type && String(payload.type).includes('offer')) {
        fetchNotifications();
      }
      if (payload?.type === 'notification') {
        fetchNotifications();
      }
      if (payload?.type === 'message') {
        fetchNotifications();
      }
    });

    return () => {
      socket?.close();
    };
  }, [user, fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    await request<void>(`/notifications/${notificationId}/read`, { method: 'PATCH' });
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    await request<void>('/notifications/read-all', { method: 'PATCH' });
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
