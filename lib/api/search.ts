import { apiClient } from './axios';
import type { Product, ProductMeta } from '@/types/product';

export interface SearchParams {
  q: string;
  category?: string;
  page?: number;
  per_page?: number;
}

export interface SearchResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: ProductMeta & {
    search_query: string;
    category: string | null;
  };
}

export const searchApi = {
  /**
   * Search products by name and optionally filter by category
   */
  searchProducts: async (params: SearchParams): Promise<SearchResponse> => {
    const { q, category, page = 1, per_page = 12 } = params;

    const queryParams: Record<string, any> = {
      q,
      page,
      per_page,
    };

    if (category) {
      queryParams.category = category;
    }

    const { data } = await apiClient.get<SearchResponse>('/api/search', {
      params: queryParams,
    });

    return data;
  },
};
