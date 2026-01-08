/**
 * Parse price from WooCommerce price_html field
 * Extracts numeric price from HTML string like:
 * "<span>£20.00</span> / m²"
 */
export function parsePriceFromHtml(priceHtml: string): number {
  if (!priceHtml) return 0;

  // Match price patterns: £20.00, $20.00, 20.00, etc.
  const priceMatch = priceHtml.match(/(?:£|\$|&pound;|€)?\s*([\d,]+\.?\d*)/);

  if (priceMatch && priceMatch[1]) {
    // Remove commas and parse
    const price = parseFloat(priceMatch[1].replace(/,/g, ''));
    return isNaN(price) ? 0 : price;
  }

  return 0;
}

/**
 * Generate random discount percentage for display purposes
 * Creates realistic discount ranges for special deals
 */
export function generateDiscountPercentage(): number {
  // Generate discount between 15% and 60%
  const discounts = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
  return discounts[Math.floor(Math.random() * discounts.length)];
}

/**
 * Calculate discounted price based on percentage
 */
export function calculateDiscountedPrice(originalPrice: number, discountPercent: number): number {
  return originalPrice * (1 - discountPercent / 100);
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = '£'): string {
  return `${currency}${price.toFixed(2)}`;
}