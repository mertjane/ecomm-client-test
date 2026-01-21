import { apiClient } from './axios';
import { AxiosResponse } from 'axios'; // Import AxiosResponse for correct typing
import type {
  Cart,
  CartResponse,
  CartTotalsResponse,
  AddToCartPayload,
  UpdateCartItemPayload // Added this import based on your previous types
} from '@/types/cart';

const CART_TOKEN_KEY = 'cart_token';

/**
 * Get cart token from localStorage
 */
export const getCartToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_TOKEN_KEY);
};

/**
 * Save cart token to localStorage
 */
export const saveCartToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_TOKEN_KEY, token);
};

/**
 * Clear cart token from localStorage
 */
export const clearCartToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_TOKEN_KEY);
};

/**
 * Get headers with cart token
 */
const getCartHeaders = () => {
  const token = getCartToken();
  return token ? { 'X-Cart-Token': token } : {};
};

/**
 * Handle cart response - extract and save cart token
 * Wraps the Axios response to extract headers before returning data
 */
const handleCartResponse = <T>(response: AxiosResponse<T>): T => {
  // Axios headers are usually lowercased
  const cartToken = response.headers['x-cart-token'];

  if (cartToken && typeof cartToken === 'string') {
    saveCartToken(cartToken);
  }

  return response.data;
};

/**
 * Get cart contents
 */
export const getCart = async (): Promise<CartResponse> => {
  const response = await apiClient.get<CartResponse>('/api/cart', {
    headers: getCartHeaders(),
  });
  return handleCartResponse(response);
};

/**
 * Add item to cart
 * FIX: Added 'sqm' to the payload sent to server
 */
export const addToCart = async (payload: AddToCartPayload): Promise<CartResponse> => {
  const response = await apiClient.post<CartResponse>(
    '/api/cart/add',
    {
      productId: payload.productId,
      quantity: payload.quantity,
      sqm: payload.sqm, // Essential for Tile calculations
      variation: payload.variation || [],
      variationId: payload.variationId,
    },
    {
      headers: getCartHeaders(),
    }
  );
  return handleCartResponse(response);
};

/**
 * Update cart item quantity
 * FIX: Accepts SQM updates alongside quantity
 */
export const updateCartItem = async (payload: UpdateCartItemPayload): Promise<CartResponse> => {
  const response = await apiClient.put<CartResponse>(
    `/api/cart/item/${payload.key}`,
    { 
      quantity: payload.quantity,
      sqm: payload.sqm // Send updated SQM to server
    },
    {
      headers: getCartHeaders(),
    }
  );
  return handleCartResponse(response);
};

/**
 * Remove item from cart
 * @param key - Item key to remove
 */
export const removeFromCart = async (key: string): Promise<CartResponse> => {
  const response = await apiClient.delete<CartResponse>(`/api/cart/item/${key}`, {
    headers: getCartHeaders(),
  });
  return handleCartResponse(response);
};

/**
 * Clear entire cart
 */
export const clearCart = async (): Promise<CartResponse> => {
  const response = await apiClient.delete<CartResponse>('/api/cart', {
    headers: getCartHeaders(),
  });
  return handleCartResponse(response);
};

/**
 * Apply coupon to cart
 * @param code - Coupon code
 */
export const applyCoupon = async (code: string): Promise<CartResponse> => {
  const response = await apiClient.post<CartResponse>(
    '/api/cart/coupon',
    { code },
    {
      headers: getCartHeaders(),
    }
  );
  return handleCartResponse(response);
};

/**
 * Remove coupon from cart
 * @param code - Coupon code to remove
 */
export const removeCoupon = async (code: string): Promise<CartResponse> => {
  const response = await apiClient.delete<CartResponse>(`/api/cart/coupon/${code}`, {
    headers: getCartHeaders(),
  });
  return handleCartResponse(response);
};

/**
 * Get cart totals
 */
export const getCartTotals = async (): Promise<CartTotalsResponse> => {
  const response = await apiClient.get<CartTotalsResponse>('/api/cart/totals', {
    headers: getCartHeaders(),
  });
  return handleCartResponse(response);
};

/**
 * Sync local cart with server (for initial load)
 */
export const syncCart = async (): Promise<Cart | null> => {
  try {
    const response = await getCart();
    if (response.success && response.data) {
      return response.data.cart;
    }
    return null;
  } catch (error) {
    console.error('Failed to sync cart:', error);
    return null;
  }
};