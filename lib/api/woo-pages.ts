import { apiClient } from './axios';
import type { PageApiResponse } from '@/types/page';

export const wooPagesApi = {
  /**
   * Fetch a page by slug
   */
  fetchPageBySlug: async (slug: string): Promise<PageApiResponse> => {
    const { data } = await apiClient.get<PageApiResponse>(`/api/pages/${slug}`);
    return data;
  },
};
