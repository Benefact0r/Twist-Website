import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { request } from '@/lib/apiClient';

type AdminRole = 'admin' | 'moderator' | 'support';

interface AdminState {
  isAdmin: boolean;
  isModerator: boolean;
  isSupport: boolean;
  hasAdminAccess: boolean;
  role: AdminRole | null;
  loading: boolean;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [state, setState] = useState<AdminState>({
    isAdmin: false,
    isModerator: false,
    isSupport: false,
    hasAdminAccess: false,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setState({
          isAdmin: false,
          isModerator: false,
          isSupport: false,
          hasAdminAccess: false,
          role: null,
          loading: false,
        });
        return;
      }

      try {
        const me = await request<{ user: { role?: string } }>('/auth/me');
        const role = (me.user?.role || '').toLowerCase();
        if (!role) {
          setState({
            isAdmin: false,
            isModerator: false,
            isSupport: false,
            hasAdminAccess: false,
            role: null,
            loading: false,
          });
          return;
        }

        setState({
          isAdmin: role === 'admin',
          isModerator: role === 'moderator',
          isSupport: role === 'support',
          hasAdminAccess: role === 'admin', // Only admins can access admin panel
          role,
          loading: false,
        });
      } catch {
        setState({
          isAdmin: false,
          isModerator: false,
          isSupport: false,
          hasAdminAccess: false,
          role: null,
          loading: false,
        });
      }
    };

    checkAdminRole();
  }, [user]);

  return state;
};

// Enhanced admin action logging with email and role
export const logAdminAction = async (
  adminId: string,
  actionType: string,
  entityType: string,
  entityId: string,
  details?: Record<string, unknown>
) => {
  try {
    await request('/admin/audit-logs', {
      method: 'POST',
      body: {
      admin_id: adminId,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      details: {
        ...(details || {}),
        timestamp: new Date().toISOString(),
      },
      },
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

// Suspension duration options
export const SUSPENSION_DURATIONS = [
  { value: '24h', label: '24 Hours' },
  { value: '72h', label: '72 Hours (3 Days)' },
  { value: '7d', label: '7 Days' },
  { value: 'permanent', label: 'Permanent' },
] as const;

export type SuspensionDuration = '24h' | '72h' | '7d' | 'permanent';

// Suspension reason categories
export const SUSPENSION_REASONS = [
  { value: 'spam', label: 'Spam / Advertising' },
  { value: 'harassment', label: 'Harassment / Abuse' },
  { value: 'fraud', label: 'Fraud / Scam' },
  { value: 'inappropriate_content', label: 'Inappropriate Content' },
  { value: 'terms_violation', label: 'Terms of Service Violation' },
  { value: 'other', label: 'Other' },
] as const;

export type SuspensionReason = typeof SUSPENSION_REASONS[number]['value'];

// Calculate suspension expiry date
export const calculateSuspensionExpiry = (duration: SuspensionDuration): Date | null => {
  if (duration === 'permanent') return null;
  
  const now = new Date();
  switch (duration) {
    case '24h':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '72h':
      return new Date(now.getTime() + 72 * 60 * 60 * 1000);
    case '7d':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
};

// Check if suspension has expired
export const isSuspensionExpired = (expiresAt: string | null): boolean => {
  if (!expiresAt) return false; // Permanent suspension never expires
  return new Date(expiresAt) < new Date();
};
