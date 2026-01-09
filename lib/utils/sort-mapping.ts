import type { SortOption } from '@/types/product';

/**
 * Maps our SortOption to WooCommerce API parameters
 */
export function mapSortToWooCommerce(sortBy: SortOption): { orderby: string; order: string } {
  switch (sortBy) {
    case 'date':
      return { orderby: 'date', order: 'desc' }; // Latest first
    case 'popularity':
      return { orderby: 'popularity', order: 'desc' }; // Most popular first
    case 'title':
      return { orderby: 'title', order: 'asc' }; // A-Z
    case 'price':
      return { orderby: 'price', order: 'asc' }; // Low to High
    case 'price-desc':
      return { orderby: 'price', order: 'desc' }; // High to Low
    default:
      return { orderby: 'date', order: 'desc' };
  }
}