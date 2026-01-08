
import { useQuery } from '@tanstack/react-query';
import { megamenuApi } from '@/lib/api/megamenu';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setMegamenuData, setMegamenuError } from '@/lib/redux/slices/megamenuSlice';
import { normalizeMegamenuItem } from '@/lib/utils/normalizeMegamenuItem';
import { MegamenuItem } from '@/types/megamenu';

export const useMegamenu = () => {
  const dispatch = useAppDispatch();

  const query = useQuery<MegamenuItem[], Error>({
    queryKey: ['megamenu'],
    queryFn: async () => {
      try {
        const response = await megamenuApi.fetchMegamenu();
        const normalizedData = response.data.map(normalizeMegamenuItem);
        dispatch(setMegamenuData(normalizedData));
        return normalizedData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch megamenu';
        dispatch(setMegamenuError(errorMessage));
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 2,
  });

  return query;
};
