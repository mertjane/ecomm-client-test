'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setCart, setLoading } from '@/lib/redux/slices/cartSlice';
import { getCart, getCartToken } from '@/lib/api/cart';

/**
 * CartInitializer - Syncs cart from server on app load
 * This component runs once on mount to restore the cart state
 * from the server using the stored cart token.
 */
export function CartInitializer() {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once
    if (initialized.current) return;
    initialized.current = true;

    const syncCartFromServer = async () => {
      const token = getCartToken();

      // Only sync if we have a stored token
      if (!token) {
        console.log('[CartInitializer] No cart token found, skipping sync');
        return;
      }

      console.log('[CartInitializer] Found cart token, syncing from server...');
      dispatch(setLoading(true));

      try {
        const response = await getCart();

        if (response.success && response.data?.cart) {
          dispatch(setCart({
            cart: response.data.cart,
            cartHash: response.data.cartHash || '',
          }));
          console.log('[CartInitializer] Cart synced successfully:', response.data.cart.items.length, 'items');
        }
      } catch (error) {
        console.error('[CartInitializer] Failed to sync cart:', error);
        // Don't clear the token on error - the server might be temporarily unavailable
      } finally {
        dispatch(setLoading(false));
      }
    };

    syncCartFromServer();
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}
