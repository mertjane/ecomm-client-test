import { useInfiniteQuery } from '@tanstack/react-query';
import { getProductsByCategory } from '@/lib/api/products';


export const useProducts = ({ 
  slug, 
  type, // Add type here
  per_page = 12 
}: { 
  slug: string; 
  type: string; // Add type here
  per_page?: number 
}) => {
  const query = useInfiniteQuery({
    // Add type to queryKey so React Query caches color vs category separately
    queryKey: ['products', type, slug], 
    queryFn: ({ pageParam = 1 }) => 
      getProductsByCategory(slug, type, pageParam as number, per_page),
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
    meta: latestMeta, // This variable is now defined and ready for your component
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
  };
};