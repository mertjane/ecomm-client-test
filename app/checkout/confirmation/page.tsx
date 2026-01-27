'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order');

  // Redirect if no order ID
  useEffect(() => {
    if (!orderId) {
      router.replace('/');
    }
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-semibold uppercase tracking-wide mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Your order has been successfully placed.
          </p>
          <p className="text-muted-foreground mb-8">
            We've sent a confirmation email with your order details.
          </p>

          {/* Order Details Card */}
          <div className="bg-background rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Package className="w-6 h-6 text-emperador" />
              <h2 className="text-xl font-semibold uppercase tracking-wide">
                Order Details
              </h2>
            </div>

            <div className="border-t border-b border-border py-6 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="text-2xl font-bold text-emperador">{orderId}</p>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>You will receive an email confirmation shortly at your registered email address.</p>
              <p>You can track your order status in your account dashboard.</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-background rounded-lg shadow-lg p-6 mb-8">
            <h3 className="font-semibold uppercase tracking-wide text-sm mb-4">
              What Happens Next?
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-emperador text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  1
                </div>
                <p className="font-medium">Order Processing</p>
                <p className="text-muted-foreground text-xs mt-1">
                  We'll prepare your order for dispatch
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-emperador text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  2
                </div>
                <p className="font-medium">Shipping</p>
                <p className="text-muted-foreground text-xs mt-1">
                  You'll receive tracking information
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-emperador text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  3
                </div>
                <p className="font-medium">Delivery</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Your tiles will arrive safely
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="uppercase tracking-wide" size="lg">
              <Link href="/my-account">
                <Package className="w-4 h-4 mr-2" />
                View My Orders
              </Link>
            </Button>
            <Button asChild variant="outline" className="uppercase tracking-wide" size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Support Note */}
          <p className="text-sm text-muted-foreground mt-8">
            Need help?{' '}
            <Link href="/contact" className="text-emperador hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-emperador" />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
