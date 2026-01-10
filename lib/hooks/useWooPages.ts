import { useQuery } from '@tanstack/react-query';
import { wooPagesApi } from '../api/woo-pages';
/* import type { PageSlug } from '@/types/page'; */

/**
 * Hook to fetch a page by slug using TanStack Query
 * Pages are cached for 24 hours on the backend, so we can cache them longer on the client
 */
export function usePageBySlug(slug: string) {
  return useQuery({
    queryKey: ['page', slug],
    queryFn: () => wooPagesApi.fetchPageBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - pages don't change often
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - match backend cache
  });
}
