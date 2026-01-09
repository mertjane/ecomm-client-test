import { apiClient } from './axios';
import { SpecialDealApiResponse, SpecialDeal, WooCommerceProduct } from '@/types/special-deals';
import { PLACEHOLDER_IMAGE } from '@/lib/constants/images';
import {
  parsePriceFromHtml,
  generateDiscountPercentage,
} from '@/lib/utils/price';
import {
  generateBadgeType,
  getBadgeText,
  generateExpiryDate,
  generateStockQuantity
} from '@/lib/utils/deals';

// Transform WooCommerce product to SpecialDeal format
const transformProductToSpecialDeal = (product: WooCommerceProduct): SpecialDeal => {
  // Parse actual price from price_html since regular_price/sale_price are empty
  const actualPrice = parsePriceFromHtml(product.price_html);

  // Generate discount percentage for special deals display
  const discountPercent = generateDiscountPercentage();

  // Calculate what the "original" price would have been
  const originalPrice = actualPrice / (1 - discountPercent / 100);
  const discountPrice = actualPrice;

  // Determine badge type and text based on discount
  const badgeType = generateBadgeType(discountPercent);
  const badgeText = getBadgeText(badgeType);

  return {
    id: product.id.toString(),
    title: product.name,
    category: product.categories?.[0]?.name,
    image: product.images?.[0]?.src || product.yoast_head_json?.og_image?.[0]?.url || PLACEHOLDER_IMAGE,
    link: `/products/${product.slug}`,
    originalPrice: parseFloat(originalPrice.toFixed(2)),
    discountPrice: parseFloat(discountPrice.toFixed(2)),
    badgeType,
    badgeText,
    expiresAt: generateExpiryDate(),
    stock: product.stock_status === 'instock' ? generateStockQuantity() : 0,
  };
};

export const specialDealApi = {
  fetchSpecialDeals: async (page = 1, perPage = 8): Promise<{ deals: SpecialDeal[]; meta: SpecialDealApiResponse['meta'] }> => {
    const { data } = await apiClient.get<SpecialDealApiResponse>('/api/products/category/special-deals', {
      params: { page, per_page: perPage }
    });

    const deals = (data.products || []).map(transformProductToSpecialDeal);

    return {
      deals,
      meta: data.meta
    };
  },
};