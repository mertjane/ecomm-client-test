import { apiClient } from './axios';

export interface ProductVariation {
  id: number;
  date_created: string;
  date_modified: string;
  description: string;
  permalink: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  name: string;
  price_html: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_status: string;
  attributes: Array<{
    id: number;
    name: string;
    option: string;
  }>;
  image: {
    id: number;
    src: string;
    alt: string;
  };
}

/**
 * Fetch a single product variation
 */
export async function fetchProductVariation(
  productId: number,
  variationId: number
): Promise<ProductVariation> {
  const response = await apiClient.get(`/api/variations/${productId}/${variationId}`);
  return response.data.data;
}

/**
 * Fetch all variations for a product
 */
export async function fetchProductVariations(
  productId: number
): Promise<ProductVariation[]> {
  console.log('Fetching variations for product:', productId);
  const response = await apiClient.get(`/api/variations/${productId}`);
  console.log('Variations API full response:', response);
  console.log('Variations data:', response.data);
  console.log('Variations array:', response.data.data);
  return response.data.data || [];
}
