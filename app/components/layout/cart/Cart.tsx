'use client';

import { useCart } from '@/lib/hooks/useCart';
import { useCheckout } from '@/lib/hooks/useCheckout';
import { X, Plus, Minus, ShoppingBag, Trash2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/cart';

export function Cart() {
  const {
    items,
    isOpen,
    totals,
    closeCart,
    removeItem,
    updateItem,
    clearCart
  } = useCart();
  const { goToCheckout } = useCheckout();

  const handleClose = () => {
    closeCart();
  };

  const handleRemove = async (key: string) => {
    await removeItem(key);
  };

  // Logic to handle tile quantity/SQM updates
  const handleUpdateQuantity = async (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    // Calculate new SQM based on current ratio (SQM / Quantity)
    // This assumes the ratio is constant (which it is for tiles)
    const sqmPerTile = item.sqm / item.quantity;
    const newSqm = Number((sqmPerTile * newQuantity).toFixed(2));

    await updateItem(item.key, newQuantity, newSqm);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[600px] bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-xl font-semibold uppercase tracking-wide">
                Shopping Cart
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-center mb-6">
                Add some products to get started
              </p>
              <Button onClick={handleClose} className="uppercase tracking-wide">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-4 border-b border-border pb-4 last:border-0"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={handleClose}
                      className="relative w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                            <Link
                            href={`/products/${item.slug}`}
                            onClick={handleClose}
                            className="font-medium text-base hover:text-primary transition-colors line-clamp-2"
                            >
                            {item.name}
                            </Link>
                            {/* Line Total */}
                            <span className="font-semibold whitespace-nowrap">
                                {totals.currencySymbol}{parseFloat(item.lineTotal).toFixed(2)}
                            </span>
                        </div>

                        {/* Variation Name (e.g., "Free Sample (100x100)") */}
                        {item.variationName && (
                          <div className="mt-1">
                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {item.variationName}
                            </span>
                          </div>
                        )}

                        {/* Variations / Attributes - FIXED SECTION */}
                        {!item.variationName && Array.isArray(item.variation) && item.variation.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.variation.map((v, i) => (
                              <span key={i} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {v.attribute}: {v.value}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Unit Price - Per piece for samples, Per SQM for tiles */}
                        <div className="text-xs text-muted-foreground mt-1">
                             {totals.currencySymbol}{item.price} {item.isSample ? 'per piece' : '/ m²'}
                        </div>
                      </div>

                      {/* Controls Footer */}
                      <div className="flex items-end justify-between mt-3">
                        <div className="flex flex-col gap-1">
                             {/* Quantity Controls */}
                            <div className="flex items-center border border-border rounded-md w-fit">
                                <button
                                    onClick={() => handleUpdateQuantity(item, -1)}
                                    className="p-1 hover:bg-muted transition-colors disabled:opacity-50"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => handleUpdateQuantity(item, 1)}
                                    className="p-1 hover:bg-muted transition-colors"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                            {/* Only show SQM for non-sample items */}
                            {!item.isSample && item.sqm > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                  {item.sqm} m²
                              </span>
                            )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(item.key)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Stock Warning */}
                      {item.stockQuantity !== null && item.quantity >= item.stockQuantity && (
                          <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
                              <AlertCircle className="w-3 h-3" />
                              <span>Max stock reached</span>
                          </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6 bg-muted/10">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      {totals.currencySymbol}{totals.subtotal}
                    </span>
                  </div>
                  {/* Tax */}
                  {parseFloat(totals.tax) > 0 && (
                       <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>{totals.currencySymbol}{totals.tax}</span>
                      </div>
                  )}
                  {/* Total */}
                  <div className="flex items-center justify-between text-lg font-bold border-t border-border/50 pt-2">
                    <span>Total</span>
                    <span>{totals.currencySymbol}{totals.total}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center mb-4">
                  Shipping calculated at checkout
                </p>

                <div className="space-y-3">
                  <Button
                    className="w-full uppercase tracking-wide font-bold"
                    size="lg"
                    onClick={() => {
                      closeCart();
                      goToCheckout();
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full uppercase tracking-wide"
                    onClick={handleClose}
                  >
                    Continue Shopping
                  </Button>
                </div>

                {items.length > 0 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleClearCart}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors underline"
                    >
                      Clear All Items
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}