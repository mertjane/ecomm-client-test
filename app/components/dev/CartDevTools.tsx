/* 'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { loadMockupData, clearCart } from '@/lib/redux/slices/cartSlice';
import { Button } from '@/components/ui/button';

export function CartDevTools() {
  const dispatch = useAppDispatch();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide mb-2">
        Cart Dev Tools
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={() => dispatch(loadMockupData())}
        className="w-full text-xs"
      >
        Load Mockup Data
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => dispatch(clearCart())}
        className="w-full text-xs"
      >
        Clear Cart
      </Button>
    </div>
  );
}
 */