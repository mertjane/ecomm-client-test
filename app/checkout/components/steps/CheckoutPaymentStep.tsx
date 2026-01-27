'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCheckout } from '@/lib/hooks/useCheckout';
import { cn } from '@/lib/utils';
import type { PaymentMethod, CardDetails } from '@/lib/redux/slices/checkoutSlice';

// Payment method icons as simple components
function PayPalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.66h6.607c2.177 0 3.884.498 5.086 1.482 1.203.984 1.805 2.414 1.805 4.291 0 2.42-.809 4.324-2.428 5.713-1.618 1.389-3.834 2.083-6.647 2.083H8.022l-1.006 4.708h.06Z"/>
    </svg>
  );
}

function ApplePayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.72 8.2c-.1.08-1.87 1.07-1.87 3.28 0 2.56 2.25 3.47 2.31 3.49-.01.06-.36 1.24-1.19 2.45-.73 1.08-1.5 2.15-2.7 2.15s-1.48-.7-2.85-.7c-1.33 0-1.8.72-2.89.72s-1.83-.99-2.67-2.2C4.66 15.42 4 12.78 4 10.26c0-4.01 2.6-6.14 5.17-6.14 1.36 0 2.5.89 3.35.89.82 0 2.1-.95 3.67-.95.59 0 2.72.05 4.12 2.06l-2.59.08Zm-3.03-3.78c.55-.65.94-1.56.94-2.47 0-.13-.01-.26-.04-.36-.9.03-1.97.6-2.62 1.35-.51.58-.98 1.49-.98 2.41 0 .14.02.28.03.33.06.01.15.02.24.02.81 0 1.81-.54 2.43-1.28Z"/>
    </svg>
  );
}

function GooglePayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24Z"/>
    </svg>
  );
}

interface PaymentOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

export function CheckoutPaymentStep() {
  const {
    paymentMethod,
    cardDetails,
    error,
    selectPaymentMethod,
    updateCardDetails,
    completePayment,
    goBack,
    clearError,
  } = useCheckout();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);

  // Check for Apple Pay availability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Apple Pay requires a secure context (HTTPS)
      const isSecureContext = window.isSecureContext;
      if (isSecureContext && (window as any).ApplePaySession) {
        try {
          setApplePayAvailable((window as any).ApplePaySession.canMakePayments());
        } catch {
          // Apple Pay not available (e.g., not on Safari or no cards set up)
          setApplePayAvailable(false);
        }
      }
    }
  }, []);

  // Check for Google Pay availability (simplified check)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Google Pay also prefers secure context
      const isSecureContext = window.isSecureContext;
      if (isSecureContext && (window as any).PaymentRequest) {
        // In production, you'd make a proper Google Pay API check
        setGooglePayAvailable(true);
      }
    }
  }, []);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'card',
      label: 'Credit / Debit Card',
      description: 'Pay securely with your card',
      icon: <CreditCard className="w-6 h-6" />,
      available: true,
    },
    {
      id: 'paypal',
      label: 'PayPal',
      description: 'You will be redirected to PayPal',
      icon: <PayPalIcon className="w-6 h-6" />,
      available: true,
    },
    {
      id: 'apple_pay',
      label: 'Apple Pay',
      description: 'Pay with Apple Pay',
      icon: <ApplePayIcon className="w-6 h-6" />,
      available: applePayAvailable,
    },
    {
      id: 'google_pay',
      label: 'Google Pay',
      description: 'Pay with Google Pay',
      icon: <GooglePayIcon className="w-6 h-6" />,
      available: googlePayAvailable,
    },
  ];

  const handleCardChange = (field: keyof CardDetails, value: string) => {
    updateCardDetails({
      ...(cardDetails || { cardNumber: '', expiryDate: '', cvv: '', nameOnCard: '' }),
      [field]: value,
    });
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substring(0, 19) : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleContinue = () => {
    setIsSubmitting(true);
    const success = completePayment();
    if (!success) {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide mb-2">
          Payment Method
        </h2>
        <p className="text-muted-foreground">
          Select how you'd like to pay for your order.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {paymentOptions
          .filter((option) => option.available)
          .map((option) => (
            <div key={option.id}>
              <button
                type="button"
                onClick={() => {
                  selectPaymentMethod(option.id);
                  clearError();
                }}
                className={cn(
                  'w-full flex items-center gap-4 p-4 border rounded-lg transition-colors text-left',
                  paymentMethod === option.id
                    ? 'border-emperador bg-emperador/5 ring-2 ring-emperador/20'
                    : 'border-border hover:border-emperador/50'
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    paymentMethod === option.id
                      ? 'bg-emperador text-white'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {option.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    paymentMethod === option.id
                      ? 'border-emperador'
                      : 'border-muted-foreground/30'
                  )}
                >
                  {paymentMethod === option.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-emperador" />
                  )}
                </div>
              </button>

              {/* Card Details Form */}
              {option.id === 'card' && paymentMethod === 'card' && (
                <div className="mt-4 p-4 border border-border rounded-lg bg-muted/20 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails?.cardNumber || ''}
                      onChange={(e) =>
                        handleCardChange('cardNumber', formatCardNumber(e.target.value))
                      }
                      maxLength={19}
                      className="h-12"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={cardDetails?.expiryDate || ''}
                        onChange={(e) =>
                          handleCardChange('expiryDate', formatExpiryDate(e.target.value))
                        }
                        maxLength={5}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails?.cvv || ''}
                        onChange={(e) =>
                          handleCardChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))
                        }
                        maxLength={4}
                        type="password"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      placeholder="John Doe"
                      value={cardDetails?.nameOnCard || ''}
                      onChange={(e) => handleCardChange('nameOnCard', e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

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
          disabled={isSubmitting || !paymentMethod}
          className="uppercase tracking-wide"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Review Order'
          )}
        </Button>
      </div>
    </div>
  );
}
