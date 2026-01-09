import { useInfiniteQuery } from '@tanstack/react-query';
import { filterApi } from '@/lib/api/filters';
import { mapSortToWooCommerce } from '@/lib/utils/sort-mapping';
import type { SortOption } from '@/types/product';

interface UseFilteredProductsParams {
  roomTypeUsage?: string[];
  material?: string[];
  colour?: string[];
  finish?: string[];
  per_page?: number;
  sortBy?: SortOption;
}

/**
 * Custom hook for fetching filtered products with infinite scroll support
 * Used for attribute-based filtering (usage areas, colours, finishes, materials)
 */
export const useFilteredProducts = ({
  roomTypeUsage,
  material,
  colour,
  finish,
  per_page = 12,
  sortBy = 'date',
}: UseFilteredProductsParams) => {
  // Map sortBy to WooCommerce params
  const { orderby, order } = mapSortToWooCommerce(sortBy);

  // Build filter params
  const filterParams = {
    ...(roomTypeUsage && roomTypeUsage.length > 0 && { 'pa_room-type-usage': roomTypeUsage.join(',') }),
    ...(material && material.length > 0 && { pa_material: material.join(',') }),
    ...(colour && colour.length > 0 && { pa_colour: colour.join(',') }),
    ...(finish && finish.length > 0 && { pa_finish: finish.join(',') }),
  };

  const query = useInfiniteQuery({
    // Include all filter params and sortBy in queryKey for proper cache invalidation
    queryKey: ['filtered-products', filterParams, sortBy],
    queryFn: ({ pageParam = 1 }) =>
      filterApi.getFilteredProducts({
        ...filterParams,
        page: pageParam as number,
        per_page,
        orderby,
        order,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.has_next_page ? lastPage.meta.current_page + 1 : undefined;
    },
    enabled: Object.keys(filterParams).length > 0, // Only run query if at least one filter is set
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
