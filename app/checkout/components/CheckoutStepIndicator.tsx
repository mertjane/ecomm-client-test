'use client';

import { Check, User, MapPin, Truck, CreditCard, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CheckoutStep } from '@/lib/redux/slices/checkoutSlice';

interface Step {
  id: CheckoutStep;
  label: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { id: 'login', label: 'Login', icon: <User className="w-4 h-4" /> },
  { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
  { id: 'shipping', label: 'Shipping', icon: <Truck className="w-4 h-4" /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'review', label: 'Review', icon: <ClipboardCheck className="w-4 h-4" /> },
];

interface CheckoutStepIndicatorProps {
  currentStep: CheckoutStep;
  isAuthenticated: boolean;
  isGuestCheckout?: boolean;
}

export function CheckoutStepIndicator({
  currentStep,
  isAuthenticated,
  isGuestCheckout = false,
}: CheckoutStepIndicatorProps) {
  const stepOrder: CheckoutStep[] = ['login', 'addresses', 'shipping', 'payment', 'review'];
  const currentIndex = stepOrder.indexOf(currentStep);

  // Filter out login step if authenticated or guest checkout
  const skipLoginStep = isAuthenticated || isGuestCheckout;
  const visibleSteps = skipLoginStep
    ? steps.filter((s) => s.id !== 'login')
    : steps;

  const getStepStatus = (stepId: CheckoutStep) => {
    const stepIndex = stepOrder.indexOf(stepId);

    // Skip login if authenticated or guest checkout
    if (skipLoginStep && stepId === 'login') {
      return 'completed';
    }

    if (stepIndex < currentIndex) {
      return 'completed';
    }
    if (stepIndex === currentIndex) {
      return 'current';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden sm:flex items-center justify-between">
        {visibleSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === visibleSteps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                    status === 'completed' && 'bg-emperador text-white',
                    status === 'current' && 'bg-emperador text-white ring-4 ring-emperador/20',
                    status === 'upcoming' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium uppercase tracking-wide',
                    status === 'current' && 'text-foreground',
                    status === 'completed' && 'text-foreground',
                    status === 'upcoming' && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4',
                    status === 'completed' ? 'bg-emperador' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium uppercase tracking-wide">
            Step {currentIndex + (skipLoginStep ? 0 : 1)} of {visibleSteps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {steps.find((s) => s.id === currentStep)?.label}
          </span>
        </div>
        <div className="flex gap-1">
          {visibleSteps.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <div
                key={step.id}
                className={cn(
                  'flex-1 h-1.5 rounded-full transition-colors',
                  status === 'completed' && 'bg-emperador',
                  status === 'current' && 'bg-emperador',
                  status === 'upcoming' && 'bg-muted'
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
