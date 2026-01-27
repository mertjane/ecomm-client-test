'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useCheckout } from '@/lib/hooks/useCheckout';
import { cn } from '@/lib/utils';

export function OrderSummary() {
  const { cartItems, cartTotals, cartItemsCount, selectedShippingMethod, calculatedTotals } = useCheckout();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-background rounded-lg shadow-lg overflow-hidden sticky top-8">
      {/* Header - Collapsible on mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 border-b border-border lg:cursor-default"
      >
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5" />
          <h2 className="text-lg font-semibold uppercase tracking-wide">
            Order Summary
          </h2>
          <span className="text-sm text-muted-foreground">
            ({cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'})
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 lg:hidden transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Content */}
      <div
        className={cn(
          'transition-all duration-300 overflow-hidden',
          isExpanded ? 'max-h-[2000px]' : 'max-h-0 lg:max-h-[2000px]'
        )}
      >
        {/* Items List */}
        <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.key}
              className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              {/* Product Image */}
              <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {/* Quantity Badge */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emperador text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm font-medium hover:text-emperador transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>

                {/* Variations */}
                {Array.isArray(item.variation) && item.variation.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.variation.map((v, i) => (
                      <span
                        key={i}
                        className="text-xs text-muted-foreground"
                      >
                        {v.value}
                        {i < item.variation.length - 1 && ' / '}
                      </span>
                    ))}
                  </div>
                )}

                {/* SQM */}
                <div className="text-xs text-muted-foreground mt-1">
                  {item.sqm} m²
                </div>
              </div>

              {/* Price */}
              <div className="text-sm font-semibold whitespace-nowrap">
                {cartTotals.currencySymbol}
                {parseFloat(item.lineTotal).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-border p-6 bg-muted/10 space-y-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              {cartTotals.currencySymbol}
              {cartTotals.subtotal}
            </span>
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedShippingMethod ? selectedShippingMethod.title : 'Shipping'}
            </span>
            {selectedShippingMethod ? (
              <span className={parseFloat(selectedShippingMethod.cost) === 0 ? 'text-green-600' : ''}>
                {parseFloat(selectedShippingMethod.cost) === 0
                  ? 'Free'
                  : `${cartTotals.currencySymbol}${selectedShippingMethod.cost}`}
              </span>
            ) : (
              <span className="text-muted-foreground">Calculated at next step</span>
            )}
          </div>

          {/* Tax */}
          {parseFloat(cartTotals.tax) > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>
                {cartTotals.currencySymbol}
                {cartTotals.tax}
              </span>
            </div>
          )}

          {/* Discount */}
          {parseFloat(cartTotals.discount) > 0 && (
            <div className="flex items-center justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>
                -{cartTotals.currencySymbol}
                {cartTotals.discount}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-bold border-t border-border pt-3 mt-3">
            <span>Total</span>
            <span>
              {calculatedTotals.currencySymbol}
              {calculatedTotals.total}
            </span>
          </div>
        </div>

        {/* Security Note */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure checkout
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
