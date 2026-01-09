import { apiClient } from './axios';
import type { Product } from '@/types/product';

export interface PopularProductsResponse {
  count: number;
  products: Product[];
}

export const popularProductsApi = {
  /**
   * Get popular products (cached on server for 24 hours)
   */
  getPopularProducts: async (): Promise<Product[]> => {
    try {
      console.log('Fetching popular products from:', apiClient.defaults.baseURL);
      const { data } = await apiClient.get<PopularProductsResponse>('/api/products/popular');
      console.log('Popular products response:', data);
      return data.products;
    } catch (error) {
      console.error('Error fetching popular products:', error);
      throw error;
    }
  },
};
