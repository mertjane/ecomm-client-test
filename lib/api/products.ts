import { apiClient } from './axios';
import type { ProductResponse } from '@/types/product';

/**
 * Fetches products by category slug with sorting
 * @param slug - The slug of the category (e.g., 'marble-tiles')
 * @param type - The type ('product_cat' or attribute type)
 * @param page - Page number
 * @param perPage - Items per page
 * @param orderby - WooCommerce orderby parameter
 * @param order - Sort order (asc/desc)
 * @returns Promise resolving to ProductResponse
 */
export const getProductsByCategory = async (
  slug: string,
  type: string,
  page: number = 1,
  perPage: number = 12,
  orderby: string = 'date',
  order: string = 'desc'
): Promise<ProductResponse> => {
  // Determine the correct endpoint based on the type
  // If it's 'product_cat', use category. Otherwise, use attribute.
  const endpoint = type === 'product_cat'
    ? `/api/products/category/${slug}`
    : `/api/products/attribute/${type}/${slug}`;

  const { data } = await apiClient.get<ProductResponse>(
    endpoint,
    { params: { page, per_page: perPage, orderby, order } }
  );
  return data;
};