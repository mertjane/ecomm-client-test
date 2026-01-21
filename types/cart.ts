/**
 * Cart Types - Server-side cart integration
 * Prices are per SQM (square meter) for tile products
 */

export interface CartVariation {
  attribute: string;
  value: string;
}

export interface CartItem {
  key: string; // Unique item key from server
  productId: number;
  name: string;
  slug: string;
  sku: string;
  quantity: number; // Number of tiles
  sqm: number; // Square meters (for display)
  price: string; // Price per SQM
  lineTotal: string; // sqm * price
  image: string;
  variation: CartVariation[];
  variationId?: number;
  tileSize?: string; // e.g., "300x300x16" for calculation
  stockStatus: string;
  stockQuantity: number | null;
  permalink: string;
}

export interface CartCoupon {
  code: string;
  discountType: 'percent' | 'fixed_cart' | 'fixed_product';
  amount: number;
  description: string;
}

export interface CartTotals {
  subtotal: string;
  discount: string;
  shipping: string;
  tax: string;
  total: string;
  currency: string;
  currencySymbol: string;
}

export interface Cart {
  items: CartItem[];
  coupons: CartCoupon[];
  totals: CartTotals;
  itemsCount: number;
}

export interface CartResponse {
  success: boolean;
  data: {
    cart: Cart;
    cartHash: string;
  };
  message: string;
}

export interface CartTotalsResponse {
  success: boolean;
  data: {
    itemsCount: number;
    totals: CartTotals;
    coupons: CartCoupon[];
  };
  message: string;
}

// Add to cart payload
export interface AddToCartPayload {
  productId: number;
  quantity: number;
  sqm: number;
  variation?: CartVariation[];
  variationId?: number;
  tileSize?: string;
}

// Update cart item payload
export interface UpdateCartItemPayload {
  key: string;
  quantity: number;
  sqm: number;
}
