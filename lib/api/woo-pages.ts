import { apiClient } from './axios';
import type { PageApiResponse, PageSlug } from '@/types/page';

export const wooPagesApi = {
  /**
   * Fetch a page by slug
   */
  fetchPageBySlug: async (slug: PageSlug): Promise<PageApiResponse> => {
    const { data } = await apiClient.get<PageApiResponse>(`/api/pages/${slug}`);
    return data;
  },
};
