import { useInfiniteQuery } from '@tanstack/react-query';
import { getProductsByCategory } from '@/lib/api/products';
import { mapSortToWooCommerce } from '@/lib/utils/sort-mapping';
import type { SortOption } from '@/types/product';

export const useProducts = ({
  slug,
  type,
  per_page = 12,
  sortBy = 'date'
}: {
  slug: string;
  type: string;
  per_page?: number;
  sortBy?: SortOption;
}) => {
  // Map sortBy to WooCommerce params
  const { orderby, order } = mapSortToWooCommerce(sortBy);

  const query = useInfiniteQuery({
    // Include sortBy in queryKey so React Query refetches when sorting changes
    queryKey: ['products', type, slug, sortBy],
    queryFn: ({ pageParam = 1 }) =>
      getProductsByCategory(slug, type, pageParam as number, per_page, orderby, order),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.has_next_page ? lastPage.meta.current_page + 1 : undefined;
    },
    enabled: !!slug && !!type,
  });

  // Pull the meta from the latest page fetched
  const latestMeta = query.data?.pages[query.data.pages.length - 1]?.meta;

  return {
    ...query,
    products: query.data?.pages.flatMap((p) => p.products) || [],
    meta: latestMeta,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
  };
};