'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  setCanAccess,
  setCurrentStep,
  setBillingAddress,
  setShippingAddress,
  setSameAsShipping,
  setShippingLoading,
  setShippingMethods,
  setSelectedShippingMethod,
  setPaymentMethod,
  setCardDetails,
  setAgreedToTerms,
  setProcessing,
  setError,
  setOrderId,
  initializeCheckout,
  resetCheckout,
  completeStep,
  goToPreviousStep,
  type CheckoutStep,
  type PaymentMethod,
  type Address,
  type CardDetails,
  type ShippingMethod,
} from '@/lib/redux/slices/checkoutSlice';
import { useCart } from './useCart';
import * as shippingApi from '@/lib/api/shipping';

export function useCheckout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const checkoutState = useAppSelector((state) => state.checkout);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items, totals, itemsCount, isLoading: isCartLoading } = useCart();

  /**
   * Initialize checkout - called when entering checkout from cart
   */
  const startCheckout = useCallback(() => {
    // Check both itemsCount and items.length for robustness
    if (itemsCount === 0 && items.length === 0) {
      return false;
    }

    // Convert user addresses to checkout format
    const billingAddress: Address | null = user?.billing?.address_1
      ? {
          first_name: user.billing.first_name || '',
          last_name: user.billing.last_name || '',
          company: user.billing.company,
          address_1: user.billing.address_1 || '',
          address_2: user.billing.address_2,
          city: user.billing.city || '',
          postcode: user.billing.postcode || '',
          country: user.billing.country || 'GB',
          state: user.billing.state,
          email: user.billing.email,
          phone: user.billing.phone,
        }
      : null;

    const shippingAddress: Address | null = user?.shipping?.address_1
      ? {
          first_name: user.shipping.first_name || '',
          last_name: user.shipping.last_name || '',
          company: user.shipping.company,
          address_1: user.shipping.address_1 || '',
          address_2: user.shipping.address_2,
          city: user.shipping.city || '',
          postcode: user.shipping.postcode || '',
          country: user.shipping.country || 'GB',
          state: user.shipping.state,
        }
      : null;

    dispatch(
      initializeCheckout({
        billingAddress,
        shippingAddress,
        isAuthenticated,
      })
    );

    return true;
  }, [dispatch, user, isAuthenticated, itemsCount, items.length]);

  /**
   * Navigate to checkout page
   */
  const goToCheckout = useCallback(() => {
    const success = startCheckout();
    if (success) {
      router.push('/checkout');
    }
    return success;
  }, [startCheckout, router]);

  /**
   * Handle login success during checkout
   */
  const onLoginSuccess = useCallback(() => {
    dispatch(completeStep('login'));
  }, [dispatch]);

  /**
   * Update billing address
   */
  const updateBillingAddress = useCallback(
    (address: Address) => {
      dispatch(setBillingAddress(address));
    },
    [dispatch]
  );

  /**
   * Update shipping address
   */
  const updateShippingAddress = useCallback(
    (address: Address) => {
      dispatch(setShippingAddress(address));
    },
    [dispatch]
  );

  /**
   * Toggle same as shipping
   */
  const toggleSameAsShipping = useCallback(
    (value: boolean) => {
      dispatch(setSameAsShipping(value));
    },
    [dispatch]
  );

  /**
   * Complete addresses step
   */
  const completeAddresses = useCallback(() => {
    const { billingAddress, shippingAddress, sameAsShipping } = checkoutState;

    if (!billingAddress?.address_1) {
      dispatch(setError('Please enter a billing address'));
      return false;
    }

    if (!sameAsShipping && !shippingAddress?.address_1) {
      dispatch(setError('Please enter a shipping address'));
      return false;
    }

    dispatch(completeStep('addresses'));
    return true;
  }, [dispatch, checkoutState.billingAddress, checkoutState.shippingAddress, checkoutState.sameAsShipping]);

  /**
   * Fetch shipping rates for current address
   */
  const fetchShippingRates = useCallback(async () => {
    const { billingAddress, shippingAddress, sameAsShipping } = checkoutState;
    const address = sameAsShipping ? billingAddress : shippingAddress;

    if (!address?.country) {
      dispatch(setError('Please enter a valid shipping address'));
      return false;
    }

    dispatch(setShippingLoading(true));
    dispatch(setError(null));

    try {
      const response = await shippingApi.calculateShippingRates({
        country: address.country,
        postcode: address.postcode,
        state: address.state,
        city: address.city,
      });

      if (response.success) {
        dispatch(
          setShippingMethods({
            zone: response.data.zone,
            methods: response.data.methods,
          })
        );

        if (response.data.methods.length === 0) {
          dispatch(setError(response.data.message || 'No shipping methods available for your location'));
        }

        return true;
      } else {
        dispatch(setError(response.message || 'Failed to calculate shipping'));
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to calculate shipping rates';
      dispatch(setError(message));
      return false;
    }
  }, [dispatch, checkoutState.billingAddress, checkoutState.shippingAddress, checkoutState.sameAsShipping]);

  /**
   * Refresh shipping rates - refetches with loading indicator
   */
  const refreshShippingRates = async () => {
    // Get fresh state values directly
    const { billingAddress, shippingAddress, sameAsShipping } = checkoutState;
    const address = sameAsShipping ? billingAddress : shippingAddress;

    if (!address?.country) {
      dispatch(setError('Please enter a valid shipping address'));
      return false;
    }

    // Set loading state immediately
    dispatch(setShippingLoading(true));
    dispatch(setError(null));

    try {
      // Minimum 2 second loading time for better UX
      const minLoadingDelay = new Promise(resolve => setTimeout(resolve, 2000));

      const [response] = await Promise.all([
        shippingApi.calculateShippingRates({
          country: address.country,
          postcode: address.postcode,
          state: address.state,
          city: address.city,
        }),
        minLoadingDelay,
      ]);

      if (response.success) {
        dispatch(
          setShippingMethods({
            zone: response.data.zone,
            methods: response.data.methods,
          })
        );

        if (response.data.methods.length === 0) {
          dispatch(setError(response.data.message || 'No shipping methods available for your location'));
        }

        dispatch(setShippingLoading(false));
        return true;
      } else {
        dispatch(setError(response.message || 'Failed to calculate shipping'));
        dispatch(setShippingLoading(false));
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to calculate shipping rates';
      dispatch(setError(message));
      dispatch(setShippingLoading(false));
      return false;
    }
  };

  /**
   * Select shipping method
   */
  const selectShippingMethod = useCallback(
    (method: ShippingMethod) => {
      dispatch(setSelectedShippingMethod(method));
    },
    [dispatch]
  );

  /**
   * Complete shipping step
   */
  const completeShipping = useCallback(() => {
    const { selectedShippingMethod } = checkoutState;

    if (!selectedShippingMethod) {
      dispatch(setError('Please select a shipping method'));
      return false;
    }

    dispatch(completeStep('shipping'));
    return true;
  }, [dispatch, checkoutState.selectedShippingMethod]);

  /**
   * Select payment method
   */
  const selectPaymentMethod = useCallback(
    (method: PaymentMethod) => {
      dispatch(setPaymentMethod(method));
    },
    [dispatch]
  );

  /**
   * Update card details
   */
  const updateCardDetails = useCallback(
    (details: CardDetails) => {
      dispatch(setCardDetails(details));
    },
    [dispatch]
  );

  /**
   * Complete payment step
   */
  const completePayment = useCallback(() => {
    const { paymentMethod, cardDetails } = checkoutState;

    if (!paymentMethod) {
      dispatch(setError('Please select a payment method'));
      return false;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails?.cardNumber || !cardDetails?.expiryDate || !cardDetails?.cvv) {
        dispatch(setError('Please enter valid card details'));
        return false;
      }
    }

    dispatch(completeStep('payment'));
    return true;
  }, [dispatch, checkoutState.paymentMethod, checkoutState.cardDetails]);

  /**
   * Accept terms and conditions
   */
  const acceptTerms = useCallback(
    (agreed: boolean) => {
      dispatch(setAgreedToTerms(agreed));
    },
    [dispatch]
  );

  /**
   * Place order
   */
  const placeOrder = useCallback(async () => {
    const { agreedToTerms, selectedShippingMethod } = checkoutState;

    if (!agreedToTerms) {
      dispatch(setError('Please agree to the terms and conditions'));
      return false;
    }

    if (!selectedShippingMethod) {
      dispatch(setError('Please select a shipping method'));
      return false;
    }

    dispatch(setProcessing(true));

    try {
      // TODO: Implement actual order creation API call
      // const response = await checkoutApi.createOrder({
      //   billingAddress,
      //   shippingAddress: sameAsShipping ? billingAddress : shippingAddress,
      //   shippingMethod: selectedShippingMethod,
      //   paymentMethod,
      //   items,
      // });

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock order ID
      const orderId = `ORD-${Date.now()}`;
      dispatch(setOrderId(orderId));
      dispatch(setProcessing(false));

      return orderId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order';
      dispatch(setError(message));
      return false;
    }
  }, [dispatch, checkoutState.agreedToTerms, checkoutState.selectedShippingMethod]);

  /**
   * Go back to previous step
   */
  const goBack = useCallback(() => {
    dispatch(goToPreviousStep());
  }, [dispatch]);

  /**
   * Go to specific step (for editing)
   */
  const goToStep = useCallback(
    (step: CheckoutStep) => {
      dispatch(setCurrentStep(step));
    },
    [dispatch]
  );

  /**
   * Clear checkout state
   */
  const clearCheckout = useCallback(() => {
    dispatch(resetCheckout());
  }, [dispatch]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  /**
   * Get calculated totals including shipping
   */
  const getCalculatedTotals = useCallback(() => {
    const { selectedShippingMethod } = checkoutState;
    const shippingCost = selectedShippingMethod ? parseFloat(selectedShippingMethod.cost) : 0;
    const subtotal = parseFloat(totals.subtotal || '0');
    const discount = parseFloat(totals.discount || '0');
    const total = subtotal - discount + shippingCost;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      shipping: shippingCost.toFixed(2),
      total: total.toFixed(2),
      currency: totals.currency || 'GBP',
      currencySymbol: totals.currencySymbol || '£',
    };
  }, [checkoutState.selectedShippingMethod, totals]);

  return {
    // State
    ...checkoutState,
    isAuthenticated,
    user,
    cartItems: items,
    cartTotals: totals,
    cartItemsCount: itemsCount,
    isCartLoading,

    // Calculated totals with shipping
    calculatedTotals: getCalculatedTotals(),

    // Navigation
    startCheckout,
    goToCheckout,
    goBack,
    goToStep,
    clearCheckout,

    // Step: Login
    onLoginSuccess,

    // Step: Addresses
    updateBillingAddress,
    updateShippingAddress,
    toggleSameAsShipping,
    completeAddresses,

    // Step: Shipping
    fetchShippingRates,
    refreshShippingRates,
    selectShippingMethod,
    completeShipping,

    // Step: Payment
    selectPaymentMethod,
    updateCardDetails,
    completePayment,

    // Step: Review
    acceptTerms,
    placeOrder,

    // Utils
    clearError,
  };
}
