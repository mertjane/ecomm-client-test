import { apiClient } from './axios';
import { MegamenuResponse } from '@/types/megamenu';

export const megamenuApi = {
  fetchMegamenu: async (): Promise<MegamenuResponse> => {
    const { data } = await apiClient.get<MegamenuResponse>('/api/menu');
    return data;
  },
};