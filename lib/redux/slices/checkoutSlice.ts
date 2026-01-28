import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CheckoutStep = 'login' | 'addresses' | 'shipping' | 'payment' | 'review';
export type PaymentMethod = 'card' | 'paypal' | 'apple_pay' | 'google_pay';

export interface Address {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  postcode: string;
  country: string;
  state?: string;
  email?: string;
  phone?: string;
}

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export interface ShippingMethod {
  id: number;
  methodId: string;
  title: string;
  description: string;
  cost: string;
  taxable: boolean;
}

export interface ShippingZone {
  id: number;
  name: string;
}

interface CheckoutState {
  currentStep: CheckoutStep;
  billingAddress: Address | null;
  shippingAddress: Address | null;
  sameAsShipping: boolean;
  // Guest checkout
  isGuestCheckout: boolean;
  guestEmail: string | null;
  // Shipping
  shippingZone: ShippingZone | null;
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod | null;
  isLoadingShipping: boolean;
  // Payment
  paymentMethod: PaymentMethod | null;
  cardDetails: CardDetails | null;
  // General
  isProcessing: boolean;
  error: string | null;
  canAccess: boolean;
  agreedToTerms: boolean;
  orderId: string | null;
}

const initialState: CheckoutState = {
  currentStep: 'login',
  billingAddress: null,
  shippingAddress: null,
  sameAsShipping: true,
  // Guest checkout
  isGuestCheckout: false,
  guestEmail: null,
  // Shipping
  shippingZone: null,
  shippingMethods: [],
  selectedShippingMethod: null,
  isLoadingShipping: false,
  // Payment
  paymentMethod: null,
  cardDetails: null,
  // General
  isProcessing: false,
  error: null,
  canAccess: false,
  agreedToTerms: false,
  orderId: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCanAccess: (state, action: PayloadAction<boolean>) => {
      state.canAccess = action.payload;
    },

    setGuestCheckout: (state, action: PayloadAction<boolean>) => {
      state.isGuestCheckout = action.payload;
    },

    setGuestEmail: (state, action: PayloadAction<string | null>) => {
      state.guestEmail = action.payload;
    },

    setCurrentStep: (state, action: PayloadAction<CheckoutStep>) => {
      state.currentStep = action.payload;
      state.error = null;
    },

    setBillingAddress: (state, action: PayloadAction<Address | null>) => {
      state.billingAddress = action.payload;
    },

    setShippingAddress: (state, action: PayloadAction<Address | null>) => {
      state.shippingAddress = action.payload;
      // Clear shipping methods when address changes
      state.shippingMethods = [];
      state.selectedShippingMethod = null;
      state.shippingZone = null;
    },

    setSameAsShipping: (state, action: PayloadAction<boolean>) => {
      state.sameAsShipping = action.payload;
      if (action.payload && state.billingAddress) {
        state.shippingAddress = { ...state.billingAddress };
      }
      // Clear shipping methods when address changes
      state.shippingMethods = [];
      state.selectedShippingMethod = null;
      state.shippingZone = null;
    },

    // Shipping reducers
    setShippingLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingShipping = action.payload;
    },

    setShippingMethods: (
      state,
      action: PayloadAction<{
        zone: ShippingZone | null;
        methods: ShippingMethod[];
      }>
    ) => {
      state.shippingZone = action.payload.zone;
      state.shippingMethods = action.payload.methods;
      state.isLoadingShipping = false;
      // Auto-select first method if only one available
      if (action.payload.methods.length === 1) {
        state.selectedShippingMethod = action.payload.methods[0];
      }
    },

    setSelectedShippingMethod: (state, action: PayloadAction<ShippingMethod | null>) => {
      state.selectedShippingMethod = action.payload;
    },

    clearShippingMethods: (state) => {
      state.shippingZone = null;
      state.shippingMethods = [];
      state.selectedShippingMethod = null;
    },

    setPaymentMethod: (state, action: PayloadAction<PaymentMethod | null>) => {
      state.paymentMethod = action.payload;
    },

    setCardDetails: (state, action: PayloadAction<CardDetails | null>) => {
      state.cardDetails = action.payload;
    },

    setAgreedToTerms: (state, action: PayloadAction<boolean>) => {
      state.agreedToTerms = action.payload;
    },

    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isProcessing = false;
      state.isLoadingShipping = false;
    },

    setOrderId: (state, action: PayloadAction<string | null>) => {
      state.orderId = action.payload;
    },

    initializeCheckout: (
      state,
      action: PayloadAction<{
        billingAddress?: Address | null;
        shippingAddress?: Address | null;
        isAuthenticated: boolean;
      }>
    ) => {
      const { billingAddress, shippingAddress, isAuthenticated } = action.payload;
      state.canAccess = true;
      state.billingAddress = billingAddress || null;
      state.shippingAddress = shippingAddress || null;
      state.currentStep = isAuthenticated ? 'addresses' : 'login';
      state.error = null;
      // Clear shipping when re-initializing
      state.shippingZone = null;
      state.shippingMethods = [];
      state.selectedShippingMethod = null;
    },

    resetCheckout: () => {
      return { ...initialState };
    },

    completeStep: (state, action: PayloadAction<CheckoutStep>) => {
      const stepOrder: CheckoutStep[] = ['login', 'addresses', 'shipping', 'payment', 'review'];
      const currentIndex = stepOrder.indexOf(action.payload);
      if (currentIndex < stepOrder.length - 1) {
        state.currentStep = stepOrder[currentIndex + 1];
      }
      state.error = null;
    },

    goToPreviousStep: (state) => {
      const stepOrder: CheckoutStep[] = ['login', 'addresses', 'shipping', 'payment', 'review'];
      const currentIndex = stepOrder.indexOf(state.currentStep);
      if (currentIndex > 0) {
        state.currentStep = stepOrder[currentIndex - 1];
      }
      state.error = null;
    },
  },
});

export const {
  setCanAccess,
  setGuestCheckout,
  setGuestEmail,
  setCurrentStep,
  setBillingAddress,
  setShippingAddress,
  setSameAsShipping,
  setShippingLoading,
  setShippingMethods,
  setSelectedShippingMethod,
  clearShippingMethods,
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
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
