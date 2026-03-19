import { useCallback } from 'react';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useDemoSeller() {
  const getOrCreateDemoSeller = useCallback(async (
    sellerId: string
  ): Promise<string | null> => {
    if (!sellerId) return null;

    if (UUID_REGEX.test(sellerId)) return sellerId;
    // For non-UUID mock seller ids, return as-is and let backend/profile fallbacks resolve.
    return sellerId;
  }, []);

  return { getOrCreateDemoSeller };
}
