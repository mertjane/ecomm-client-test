'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setCart,
  setLoading,
  setError,
  openCart,
  closeCart,
  toggleCart,
} from '@/lib/redux/slices/cartSlice';
import * as cartApi from '@/lib/api/cart';
import type { AddToCartPayload, CartVariation } from '@/types/cart';
import { sqmToQuantity, quantityToSqm } from '@/lib/utils/calculation';

export function useCart() {
  const dispatch = useAppDispatch();
  const { items, totals, itemsCount, isOpen, isLoading, error, cartHash } = useAppSelector(
    (state) => state.cart
  );

  /**
   * Sync cart from server on mount
   */
  const syncCart = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const cart = await cartApi.syncCart();
      if (cart) {
        dispatch(setCart({ cart, cartHash: '' }));
      }
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to sync cart'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Add product to cart
   * Calculates quantity from sqm based on tile size
   */
  const addToCart = useCallback(
    async (
      productId: number,
      sqm: number,
      tileSize: string,
      variation?: CartVariation[],
      variationId?: number
    ) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        // Convert sqm to quantity (number of tiles)
        const quantity = sqmToQuantity(sqm, tileSize);

        const payload: AddToCartPayload = {
          productId,
          quantity,
          sqm,
          variation,
          variationId,
          tileSize,
        };

        const response = await cartApi.addToCart(payload);

        if (response.success) {
          dispatch(
            setCart({
              cart: response.data.cart,
              cartHash: response.data.cartHash,
            })
          );
          dispatch(openCart()); // Open cart drawer on add
          return true;
        } else {
          dispatch(setError(response.message || 'Failed to add item'));
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add item to cart';
        dispatch(setError(message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Add sample to cart (quantity = 1, no sqm calculation)
   * Used for "Order Sample" functionality
   */
  const addSampleToCart = useCallback(
    async (productId: number, variationId?: number) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const payload: AddToCartPayload = {
          productId,
          quantity: 1,
          sqm: 0, // No sqm for samples
          variation: [],
          variationId,
          tileSize: '',
        };

        const response = await cartApi.addToCart(payload);

        if (response.success) {
          dispatch(
            setCart({
              cart: response.data.cart,
              cartHash: response.data.cartHash,
            })
          );
          dispatch(openCart()); // Open cart drawer on add
          return { success: true, message: 'Sample added to cart' };
        } else {
          const errorMsg = response.message || 'Failed to add sample';
          dispatch(setError(errorMsg));
          return { success: false, message: errorMsg };
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add sample to cart';
        dispatch(setError(message));
        return { success: false, message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Update cart item quantity and sqm
   */
  const updateItem = useCallback(
    async (key: string, quantity: number, sqm: number) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const response = await cartApi.updateCartItem({ key, quantity, sqm });

        if (response.success) {
          dispatch(
            setCart({
              cart: response.data.cart,
              cartHash: response.data.cartHash,
            })
          );
          return true;
        } else {
          dispatch(setError(response.message || 'Failed to update item'));
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update item';
        dispatch(setError(message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Update cart item by sqm (converts to quantity internally)
   */
  const updateItemBySqm = useCallback(
    async (key: string, sqm: number, tileSize: string) => {
      const quantity = sqmToQuantity(sqm, tileSize);
      return updateItem(key, quantity, sqm);
    },
    [updateItem]
  );

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(
    async (key: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const response = await cartApi.removeFromCart(key);

        if (response.success) {
          dispatch(
            setCart({
              cart: response.data.cart,
              cartHash: response.data.cartHash,
            })
          );
          return true;
        } else {
          dispatch(setError(response.message || 'Failed to remove item'));
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove item';
        dispatch(setError(message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await cartApi.clearCart();

      if (response.success) {
        dispatch(
          setCart({
            cart: response.data.cart,
            cartHash: response.data.cartHash,
          })
        );
        return true;
      } else {
        dispatch(setError(response.message || 'Failed to clear cart'));
        return false;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear cart';
      dispatch(setError(message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Apply coupon code
   */
  const applyCoupon = useCallback(
    async (code: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const response = await cartApi.applyCoupon(code);

        if (response.success) {
          dispatch(
            setCart({
              cart: response.data.cart,
              cartHash: response.data.cartHash,
            })
          );
          return true;
        } else {
          dispatch(setError(response.message || 'Invalid coupon'));
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to apply coupon';
        dispatch(setError(message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Remove coupon
   */
  const removeCoupon = useCallback(
    async (code: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const response = await cartApi.removeCoupon(code);

        if (response.success) {
          dispatch(
            setCart({
              cart: response.data.cart,
              cartHash: response.data.cartHash,
            })
          );
          return true;
        } else {
          dispatch(setError(response.message || 'Failed to remove coupon'));
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove coupon';
        dispatch(setError(message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Get sqm from quantity for a given tile size
   */
  const getSqmFromQuantity = useCallback((quantity: number, tileSize: string) => {
    return quantityToSqm(quantity, tileSize);
  }, []);

  return {
    // State
    items,
    totals,
    itemsCount,
    isOpen,
    isLoading,
    error,
    cartHash,

    // Actions
    syncCart,
    addToCart,
    addSampleToCart,
    updateItem,
    updateItemBySqm,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,

    // UI Actions
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
    toggleCart: () => dispatch(toggleCart()),

    // Utils
    getSqmFromQuantity,
  };
}
