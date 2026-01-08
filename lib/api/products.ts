import { apiClient } from './axios';
import type { ProductResponse } from '@/types/product';

/**
 * Fetches products by category slug
 * @param categorySlug - The slug of the category (e.g., 'marble-tiles')
 * @returns Promise resolving to an array of transformed Products
 */

export const getProductsByCategory = async (
  slug: string, 
  type: string, // Add type here
  page: number = 1, 
  perPage: number = 12
): Promise<ProductResponse> => {
  
  // Determine the correct endpoint based on the type
  // If it's 'product_cat', use category. Otherwise, use attribute.
  const endpoint = type === 'product_cat' 
    ? `/api/products/category/${slug}` 
    : `/api/products/attribute/${type}/${slug}`;

  const { data } = await apiClient.get<ProductResponse>(
    endpoint, 
    { params: { page, per_page: perPage } }
  );
  return data;
};