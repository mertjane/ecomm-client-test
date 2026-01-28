'use client';

import { useEffect, useRef, useState } from 'react';
import { Truck, Package, ChevronLeft, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCheckout } from '@/lib/hooks/useCheckout';
import { cn } from '@/lib/utils';
import type { ShippingMethod } from '@/lib/redux/slices/checkoutSlice';

export function CheckoutShippingStep() {
  const {
    shippingZone,
    shippingMethods,
    selectedShippingMethod,
    isLoadingShipping,
    error,
    billingAddress,
    shippingAddress,
    sameAsShipping,
    fetchShippingRates,
    refreshShippingRates,
    selectShippingMethod,
    completeShipping,
    goBack,
    clearError,
  } = useCheckout();

  // Get the effective shipping address
  const effectiveAddress = sameAsShipping ? billingAddress : shippingAddress;
  const hasFetchedRef = useRef(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(shippingMethods.length > 0);

  // Fetch shipping rates on mount if not already loaded
  useEffect(() => {
    if (shippingMethods.length === 0 && !isLoadingShipping && effectiveAddress?.country && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchShippingRates().finally(() => setHasInitialLoad(true));
    }
  }, [shippingMethods.length, isLoadingShipping, effectiveAddress?.country, fetchShippingRates]);

  const handleContinue = () => {
    completeShipping();
  };

  const handleRefresh = () => {
    clearError();
    refreshShippingRates();
  };

  const formatPrice = (cost: string) => {
    const price = parseFloat(cost);
    if (price === 0) return 'Free';
    return `£${price.toFixed(2)}`;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide mb-2">
          Shipping Method
        </h2>
        <p className="text-muted-foreground">
          Select your preferred shipping method.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Shipping Address Summary */}
      {effectiveAddress && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Shipping To
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {effectiveAddress.address_1}, {effectiveAddress.city},{' '}
            {effectiveAddress.postcode}, {effectiveAddress.country}
          </p>
        </div>
      )}

      {/* Loading State */}
      {(isLoadingShipping || (!hasInitialLoad && shippingMethods.length === 0)) && (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-lg">
          <Loader2 className="w-8 h-8 animate-spin text-emperador mb-4" />
          <p className="text-muted-foreground">
            {shippingMethods.length > 0 ? 'Recalculating shipping rates...' : 'Calculating shipping rates...'}
          </p>
        </div>
      )}

      {/* Shipping Methods - only show when NOT loading */}
      {!isLoadingShipping && shippingMethods.length > 0 && (
        <div className="space-y-3">
          {shippingZone && (
            <p className="text-sm text-muted-foreground mb-4">
              Shipping zone: <span className="font-medium">{shippingZone.name}</span>
            </p>
          )}

          {shippingMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => {
                selectShippingMethod(method);
                clearError();
              }}
              className={cn(
                'w-full flex items-center gap-4 p-4 border rounded-lg transition-colors text-left',
                selectedShippingMethod?.id === method.id
                  ? 'border-emperador bg-emperador/5 ring-2 ring-emperador/20'
                  : 'border-border hover:border-emperador/50'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  selectedShippingMethod?.id === method.id
                    ? 'bg-emperador text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Truck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{method.title}</p>
                {method.description && (
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    'font-semibold',
                    parseFloat(method.cost) === 0
                      ? 'text-foreground'
                      : 'text-foreground'
                  )}
                >
                  {formatPrice(method.cost)}
                </p>
              </div>
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  selectedShippingMethod?.id === method.id
                    ? 'border-emperador'
                    : 'border-muted-foreground/30'
                )}
              >
                {selectedShippingMethod?.id === method.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emperador" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Methods Available */}
      {hasInitialLoad && !isLoadingShipping && shippingMethods.length === 0 && !error && (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            No shipping methods available for your location.
          </p>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {/* Refresh Button (when methods are loaded or loading) */}
      {(shippingMethods.length > 0 || isLoadingShipping) && (
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoadingShipping}
            className="text-muted-foreground"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingShipping && "animate-spin")} />
            {isLoadingShipping ? 'Recalculating...' : 'Recalculate Shipping'}
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button
          variant="outline"
          onClick={goBack}
          className="uppercase tracking-wide"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedShippingMethod || isLoadingShipping}
          className="uppercase tracking-wide"
          size="lg"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
