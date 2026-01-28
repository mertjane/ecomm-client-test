'use client';

import { ReactNode } from 'react';
import { CheckoutStepIndicator } from './CheckoutStepIndicator';
import { OrderSummary } from './OrderSummary';
import { useCheckout } from '@/lib/hooks/useCheckout';

interface CheckoutLayoutProps {
  children: ReactNode;
}

export function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const { currentStep, isAuthenticated, isGuestCheckout } = useCheckout();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold uppercase tracking-wide mb-4">
              Checkout
            </h1>
            <CheckoutStepIndicator
              currentStep={currentStep}
              isAuthenticated={isAuthenticated}
              isGuestCheckout={isGuestCheckout}
            />
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Steps */}
            <main className="flex-1 min-w-0 order-2 lg:order-1">
              <div className="bg-background rounded-lg shadow-lg p-6 lg:p-8">
                {children}
              </div>
            </main>

            {/* Right Column - Order Summary */}
            <aside className="lg:w-[400px] flex-shrink-0 order-1 lg:order-2">
              <OrderSummary />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
