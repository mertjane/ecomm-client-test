import { apiClient } from './axios';
import type { FilterOptionsResponse, ProductResponse } from '@/types/product';

/**
 * Filter API client for fetching filter options and filtered products
 */
export const filterApi = {
  /**
   * Fetches all filter options (Material, Usage Areas, Colour, Finish)
   * @returns Promise resolving to filter options with counts
   */
  getFilterOptions: async (): Promise<FilterOptionsResponse> => {
    const { data } = await apiClient.get<FilterOptionsResponse>('/api/filters/options');
    return data;
  },

  /**
   * Fetches products based on filter criteria
   * @param params - Filter parameters including attribute filters, page, per_page, orderby, order
   * @returns Promise resolving to ProductResponse
   */
  getFilteredProducts: async (params: {
    'pa_room-type-usage'?: string;
    pa_material?: string;
    pa_colour?: string;
    pa_finish?: string;
    page?: number;
    per_page?: number;
    orderby?: string;
    order?: string;
  }): Promise<ProductResponse> => {
    const { data } = await apiClient.get<{ success: boolean; products: any[]; meta: any }>('/api/filters/products', { params });
    // Transform to match ProductResponse structure
    return {
      category: { id: 0, name: '', slug: '' }, // Not used for filtered results
      products: data.products,
      meta: data.meta,
    };
  },
};