import { useInfiniteQuery } from '@tanstack/react-query';
import { getNewArrivals } from '@/lib/api/products';

export const useNewArrivals = (perPage: number = 12) => {
  const query = useInfiniteQuery({
    queryKey: ['new-arrivals'],
    queryFn: ({ pageParam = 1 }) => getNewArrivals(pageParam as number, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.has_next_page ? lastPage.meta.current_page + 1 : undefined;
    },
  });

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
