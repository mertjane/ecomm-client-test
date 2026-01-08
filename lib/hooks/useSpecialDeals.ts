import { useQuery } from '@tanstack/react-query';
import { specialDealApi } from '@/lib/api/special-deals';
import { useAppDispatch } from '@/lib/redux/hooks';
import { SpecialDeal } from '@/types/special-deals';
import { setSpecialDealData, setSpecialDealError } from '../redux/slices/specialDealSlice';

export const useSpecialDeals = (page = 1, perPage = 8) => {
  const dispatch = useAppDispatch();

  const query = useQuery<SpecialDeal[], Error>({
    queryKey: ['special-deals', page, perPage],
    queryFn: async () => {
      try {
        const response = await specialDealApi.fetchSpecialDeals(page, perPage);
        dispatch(setSpecialDealData(response.deals));
        return response.deals;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch special deals';
        dispatch(setSpecialDealError(errorMessage));
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
    retry: 2,
  });

  return query;
};