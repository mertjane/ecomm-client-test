import { apiClient } from './axios';
import type { Product, ProductResponse } from '@/types/product';

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

/**
 * Fetches a single product by slug
 * @param slug - The product slug
 * @returns Promise resolving to the Product
 */
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const { data } = await apiClient.get<{ product: Product }>(`/api/products/slug/${slug}`);
  return data.product;
};

/**
 * Fetches new arrival products (from last 2 months)
 * @param page - Page number
 * @param perPage - Items per page
 * @returns Promise resolving to ProductResponse (without category)
 */
export const getNewArrivals = async (
  page: number = 1,
  perPage: number = 12
): Promise<Omit<ProductResponse, 'category'>> => {
  const { data } = await apiClient.get<Omit<ProductResponse, 'category'>>(
    '/api/products/new-arrivals',
    { params: { page, per_page: perPage } }
  );
  return data;
};