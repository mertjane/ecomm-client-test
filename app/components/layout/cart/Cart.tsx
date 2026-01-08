'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  closeCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '@/lib/redux/slices/cartSlice';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Cart() {
  const dispatch = useAppDispatch();
  const { items, isOpen, total, itemCount } = useAppSelector((state) => state.cart);

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
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
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
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
                    key={item.id}
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
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={handleClose}
                        className="font-medium text-sm hover:text-emperador transition-colors line-clamp-2 mb-1 block"
                      >
                        {item.name}
                      </Link>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        {item.sale_price && item.regular_price && item.sale_price < item.regular_price ? (
                          <>
                            <span className="font-semibold text-sm">
                              £{item.sale_price.toFixed(2)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              £{item.regular_price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-sm">
                            £{item.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-0.5 hover:bg-muted transition-colors rounded-full"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-0.5 hover:bg-muted transition-colors rounded-full"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">£{total.toFixed(2)}</span>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full uppercase tracking-wide" size="lg">
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

                {/* Clear Cart */}
                {items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors mt-4"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}