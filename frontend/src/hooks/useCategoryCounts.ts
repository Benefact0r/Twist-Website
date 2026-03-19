import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/apiClient';

async function fetchCategoryCounts(): Promise<Record<string, number>> {
  try {
    const data = await request<{ items: Array<{ slug: string; count: number }> }>('/categories/counts', { auth: false });
    const counts: Record<string, number> = {};
    for (const row of data.items || []) counts[row.slug] = row.count;
    return counts;
  } catch {
    return {};
  }
}

export function useCategoryCounts() {
  return useQuery({
    queryKey: ['category-counts'],
    queryFn: fetchCategoryCounts,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}
