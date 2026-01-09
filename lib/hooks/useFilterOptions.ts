import { useQuery } from '@tanstack/react-query';
import { filterApi } from '../api/filters';
import type { FilterOptions, FilterOption } from '@/types/product';

/**
 * Decodes HTML entities in a string
 */
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

/**
 * Custom hook to fetch and cache filter options
 * Uses TanStack Query for caching and automatic background refetching
 * Filters out options with count 0 and decodes HTML entities
 */
export function useFilterOptions() {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: async () => {
      const response = await filterApi.getFilterOptions();
      return response.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - filter options don't change often
    gcTime: 1000 * 60 * 60, // 1 hour cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => {
      // Filter out options with count 0 and decode HTML entities
      const filterAndTransformOptions = (options: FilterOption[]) =>
        options
          .filter(option => option.count > 0)
          .map(option => ({
            ...option,
            name: decodeHtmlEntities(option.name),
          }));

      return {
        pa_material: filterAndTransformOptions(data.pa_material),
        'pa_room-type-usage': filterAndTransformOptions(data['pa_room-type-usage']),
        pa_colour: filterAndTransformOptions(data.pa_colour),
        pa_finish: filterAndTransformOptions(data.pa_finish),
      } as FilterOptions;
    },
  });

  return {
    filterOptions: data,
    isLoading,
    isError,
    error: error as Error | null,
  };
}