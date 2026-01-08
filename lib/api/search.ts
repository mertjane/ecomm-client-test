import { apiClient } from './axios';
import type { ProductsApiResponse } from '@/types/product';

export interface SearchParams {
  q: string;
  category?: string;
  page?: number;
  per_page?: number;
}

export interface SearchSuggestionsParams {
  q: string;
  limit?: number;
}

export interface SearchSuggestion {
  products: Array<{
    id: number;
    name: string;
    slug: string;
    image: string | null;
    price_html: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    count: number;
  }>;
}

export interface SearchSuggestionsResponse {
  success: boolean;
  message: string;
  data: SearchSuggestion;
}

export const searchApi = {
  /**
   * Search products by name and optionally filter by category
   */
  searchProducts: async (params: SearchParams): Promise<ProductsApiResponse> => {
    const { q, category, page = 1, per_page = 12 } = params;

    const queryParams: Record<string, any> = {
      q,
      page,
      per_page,
    };

    if (category) {
      queryParams.category = category;
    }

    const { data } = await apiClient.get<ProductsApiResponse>('/api/search', {
      params: queryParams,
    });

    return data;
  },

  /**
   * Get search suggestions for autocomplete
   */
  getSearchSuggestions: async (
    params: SearchSuggestionsParams
  ): Promise<SearchSuggestion> => {
    const { q, limit = 5 } = params;

    const { data } = await apiClient.get<SearchSuggestionsResponse>(
      '/api/search/suggestions',
      {
        params: { q, limit },
      }
    );

    return data.data;
  },
};
