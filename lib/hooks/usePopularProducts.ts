import { useQuery } from '@tanstack/react-query';
import { popularProductsApi } from '../api/popularProducts';

export function usePopularProducts() {
  return useQuery({
    queryKey: ['popular-products'],
    queryFn: () => popularProductsApi.getPopularProducts(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - matches server cache
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}