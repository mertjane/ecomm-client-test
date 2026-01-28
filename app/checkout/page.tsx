'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useCheckout } from '@/lib/hooks/useCheckout';
import { useAuth } from '@/lib/hooks/useAuth';
import { CheckoutLayout } from './components/CheckoutLayout';
import { CheckoutLoginStep } from './components/steps/CheckoutLoginStep';
import { CheckoutAddressStep } from './components/steps/CheckoutAddressStep';
import { CheckoutShippingStep } from './components/steps/CheckoutShippingStep';
import { CheckoutPaymentStep } from './components/steps/CheckoutPaymentStep';
import { CheckoutReviewStep } from './components/steps/CheckoutReviewStep';

export default function CheckoutPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const {
    canAccess,
    currentStep,
    cartItemsCount,
    cartItems,
    isCartLoading,
    isAuthenticated,
    startCheckout,
  } = useCheckout();

  // Route protection - redirect if accessed directly without cart items
  useEffect(() => {
    // Wait for both auth and cart to finish loading
    if (authLoading || isCartLoading) return;

    // If no cart items, redirect to home
    if (cartItemsCount === 0 && cartItems.length === 0) {
      router.replace('/');
      return;
    }

    // If checkout not properly initialized, initialize it
    if (!canAccess) {
      startCheckout();
    }
  }, [authLoading, isCartLoading, canAccess, cartItemsCount, cartItems.length, router, startCheckout]);

  // Show loading while checking auth or cart
  if (authLoading || isCartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emperador" />
      </div>
    );
  }

  // Redirect state - don't render anything while redirecting
  if (cartItemsCount === 0 && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emperador" />
      </div>
    );
  }

  const renderStep = () => {
    // If not authenticated, show login step regardless of currentStep
    if (!isAuthenticated && currentStep === 'login') {
      return <CheckoutLoginStep />;
    }

    switch (currentStep) {
      case 'login':
        // If authenticated but step is login, auto-advance
        return <CheckoutLoginStep />;
      case 'addresses':
        return <CheckoutAddressStep />;
      case 'shipping':
        return <CheckoutShippingStep />;
      case 'payment':
        return <CheckoutPaymentStep />;
      case 'review':
        return <CheckoutReviewStep />;
      default:
        return <CheckoutAddressStep />;
    }
  };

  return (
    <CheckoutLayout>
      {renderStep()}
    </CheckoutLayout>
  );
}
