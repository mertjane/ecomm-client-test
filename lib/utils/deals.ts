import type { SpecialDeal } from '@/types/special-deals';

/**
 * Generate random badge type based on discount percentage
 */
export function generateBadgeType(discountPercent: number): SpecialDeal['badgeType'] {
  if (discountPercent >= 50) return 'hot';
  if (discountPercent >= 35) return 'flash';
  if (discountPercent >= 20) return 'limited';
  return 'discount';
}

/**
 * Generate badge text based on type
 */
export function getBadgeText(badgeType: SpecialDeal['badgeType']): string {
  switch (badgeType) {
    case 'hot':
      return 'Hot Deal';
    case 'flash':
      return 'Flash Sale';
    case 'limited':
      return 'Limited Offer';
    case 'discount':
      return 'Special Deal';
    default:
      return 'Sale';
  }
}

/**
 * Generate random expiry date for deal timer
 * Returns ISO string date between 6 hours and 7 days from now
 */
export function generateExpiryDate(): string {
  const hours = [6, 12, 24, 48, 72, 96, 120, 168]; // 6h to 7 days
  const randomHours = hours[Math.floor(Math.random() * hours.length)];
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + randomHours);
  return expiryDate.toISOString();
}

/**
 * Generate random stock quantity
 * Returns realistic low stock numbers
 */
export function generateStockQuantity(): number {
  const stocks = [3, 5, 8, 10, 12, 15, 18, 20];
  return stocks[Math.floor(Math.random() * stocks.length)];
}