'use client';

import { useRouter } from 'next/navigation';
import {
  MapPin,
  CreditCard,
  Truck,
  ChevronLeft,
  Loader2,
  Lock,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCheckout } from '@/lib/hooks/useCheckout';
import { useCart } from '@/lib/hooks/useCart';
import type { PaymentMethod } from '@/lib/redux/slices/checkoutSlice';

const paymentMethodLabels: Record<PaymentMethod, string> = {
  card: 'Credit / Debit Card',
  paypal: 'PayPal',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
};

export function CheckoutReviewStep() {
  const router = useRouter();
  const {
    billingAddress,
    shippingAddress,
    sameAsShipping,
    selectedShippingMethod,
    paymentMethod,
    cardDetails,
    agreedToTerms,
    isProcessing,
    error,
    calculatedTotals,
    acceptTerms,
    placeOrder,
    goBack,
    goToStep,
    clearCheckout,
  } = useCheckout();
  const { clearCart } = useCart();

  const handlePlaceOrder = async () => {
    const orderId = await placeOrder();
    if (orderId) {
      // Clear cart and checkout state
      await clearCart();
      clearCheckout();
      // Redirect to confirmation page
      router.push(`/checkout/confirmation?order=${orderId}`);
    }
  };

  const effectiveShippingAddress = sameAsShipping
    ? billingAddress
    : shippingAddress;

  const getMaskedCardNumber = () => {
    if (!cardDetails?.cardNumber) return '';
    const lastFour = cardDetails.cardNumber.replace(/\s/g, '').slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide mb-2">
          Review Your Order
        </h2>
        <p className="text-muted-foreground">
          Please review your order details before placing your order.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Shipping Address */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold uppercase tracking-wide text-sm">
                Shipping To
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep('addresses')}
              className="text-emperador"
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Change
            </Button>
          </div>
          {effectiveShippingAddress && (
            <div className="text-sm text-muted-foreground">
              <p className="text-foreground font-medium">
                {effectiveShippingAddress.first_name}{' '}
                {effectiveShippingAddress.last_name}
              </p>
              <p>{effectiveShippingAddress.address_1}</p>
              {effectiveShippingAddress.address_2 && (
                <p>{effectiveShippingAddress.address_2}</p>
              )}
              <p>
                {effectiveShippingAddress.city},{' '}
                {effectiveShippingAddress.postcode}
              </p>
              <p>
                {effectiveShippingAddress.state &&
                  `${effectiveShippingAddress.state}, `}
                {effectiveShippingAddress.country}
              </p>
              {billingAddress?.phone && <p>Phone: {billingAddress.phone}</p>}
            </div>
          )}
        </div>

        {/* Shipping Method */}
        {selectedShippingMethod && (
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold uppercase tracking-wide text-sm">
                  Shipping Method
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToStep('shipping')}
                className="text-emperador"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Change
              </Button>
            </div>
            <div className="text-sm">
              <p className="font-medium">{selectedShippingMethod.title}</p>
              <p className="text-muted-foreground">
                {parseFloat(selectedShippingMethod.cost) === 0
                  ? 'Free shipping'
                  : `${calculatedTotals.currencySymbol}${selectedShippingMethod.cost}`}
              </p>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold uppercase tracking-wide text-sm">
                Payment Method
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToStep('payment')}
              className="text-emperador"
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Change
            </Button>
          </div>
          <div className="text-sm">
            <p className="font-medium">
              {paymentMethod && paymentMethodLabels[paymentMethod]}
            </p>
            {paymentMethod === 'card' && cardDetails?.cardNumber && (
              <p className="text-muted-foreground">{getMaskedCardNumber()}</p>
            )}
          </div>
        </div>

        {/* Billing Address (if different) */}
        {!sameAsShipping && billingAddress && (
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold uppercase tracking-wide text-sm">
                  Billing Address
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToStep('addresses')}
                className="text-emperador"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Change
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="text-foreground font-medium">
                {billingAddress.first_name} {billingAddress.last_name}
              </p>
              <p>{billingAddress.address_1}</p>
              {billingAddress.address_2 && <p>{billingAddress.address_2}</p>}
              <p>
                {billingAddress.city}, {billingAddress.postcode}
              </p>
              <p>
                {billingAddress.state && `${billingAddress.state}, `}
                {billingAddress.country}
              </p>
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        <div className="flex items-start space-x-3 p-4 border border-border rounded-lg bg-muted/20">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => acceptTerms(checked as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
            I have read and agree to the{' '}
            <a
              href="/terms-and-conditions"
              target="_blank"
              className="text-emperador hover:underline"
            >
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              className="text-emperador hover:underline"
            >
              Privacy Policy
            </a>
            .
          </label>
        </div>

        {/* Place Order Button */}
        <div className="pt-4">
          <Button
            onClick={handlePlaceOrder}
            disabled={isProcessing || !agreedToTerms}
            className="w-full h-14 uppercase tracking-wide text-base"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Order...
              </>
            ) : (
              <>
                Place Order • {calculatedTotals.currencySymbol}
                {calculatedTotals.total}
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Your payment is secure and encrypted</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-2">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={isProcessing}
            className="uppercase tracking-wide"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
