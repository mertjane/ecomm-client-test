import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  Cart, 
  CartItem, 
  CartTotals, 
  CartCoupon, 
  UpdateCartItemPayload 
} from '@/types/cart';

interface CartState {
  items: CartItem[];
  coupons: CartCoupon[];
  totals: CartTotals;
  itemsCount: number;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  cartHash: string;
}

const initialTotals: CartTotals = {
  subtotal: '0.00',
  discount: '0.00',
  shipping: '0.00',
  tax: '0.00',
  total: '0.00',
  currency: 'GBP',
  currencySymbol: '£',
};

const initialState: CartState = {
  items: [],
  coupons: [],
  totals: initialTotals,
  itemsCount: 0,
  isOpen: false,
  isLoading: false,
  error: null,
  cartHash: '',
};

const calculateLocalTotals = (items: CartItem[], currentTotals: CartTotals): CartTotals => {
  const subtotal = items.reduce((acc, item) => {
    // Safety check for parseFloat
    const lineTotal = item.lineTotal ? parseFloat(item.lineTotal) : 0;
    return acc + lineTotal;
  }, 0);

  return {
    ...currentTotals,
    subtotal: subtotal.toFixed(2),
    total: subtotal.toFixed(2), 
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ 
      id: number; 
      name: string; 
      price: string; 
      image: string; 
      slug: string; 
      quantity: number; 
      sqm?: number; 
      variation?: any;
      variationId?: number;
    }>) => {
      const { id, name, price, image, slug, quantity, variation, sqm, variationId} = action.payload;
      
      const existingItem = state.items.find((i) => 
        i.productId === id && i.variationId === variationId
      );

      // Ensure we have numbers for calculation
      const priceVal = parseFloat(price);
      const sqmVal = sqm || 0;

      if (existingItem) {
        existingItem.quantity += quantity;
        if (sqm) existingItem.sqm += sqm;
        
        // Optimistic Line Total: (New SQM * Price) OR (New Qty * Price)
        const multiplier = existingItem.sqm > 0 ? existingItem.sqm : existingItem.quantity;
        existingItem.lineTotal = (priceVal * multiplier).toFixed(2);
      } else {
        const newItem: CartItem = {
          key: `${id}-${Date.now()}`, 
          productId: id,
          name: name,
          slug: slug,
          sku: 'local-sku',
          quantity: quantity,
          sqm: sqmVal,
          price: price, 
          // Optimistic Line Total
          lineTotal: (priceVal * (sqmVal > 0 ? sqmVal : quantity)).toFixed(2),
          image: image,
          variation: variation || [],
          variationId: variationId,
          stockStatus: 'instock',
          stockQuantity: null,
          permalink: slug
        };

        state.items.push(newItem);
      }

      state.itemsCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.totals = calculateLocalTotals(state.items, state.totals);
      state.isOpen = true; 
    },
    setCart: (state, action: PayloadAction<{ cart: Cart; cartHash: string }>) => {
      // 1. Destructure payload
      const { cart, cartHash } = action.payload;

      // 2. Guard Clause: If cart is missing, do not proceed
      if (!cart) {
        return; 
      }

      // 3. Assign with fallbacks
      state.items = cart.items || [];
      state.coupons = cart.coupons || [];
      state.totals = cart.totals || initialTotals;
      state.itemsCount = cart.itemsCount || 0;
      state.cartHash = cartHash || '';
      state.error = null;
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.key !== action.payload);
      state.itemsCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
      state.totals = calculateLocalTotals(state.items, state.totals);
    },

    updateCartItem: (state, action: PayloadAction<UpdateCartItemPayload>) => {
      const { key, quantity, sqm } = action.payload;
      const item = state.items.find((i) => i.key === key);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.key !== key);
        } else {
          item.quantity = quantity;
          item.sqm = sqm;
          
          const pricePerSqm = parseFloat(item.price || '0');
          const newLineTotal = pricePerSqm * sqm;
          item.lineTotal = newLineTotal.toFixed(2);
        }
        
        state.itemsCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
        state.totals = calculateLocalTotals(state.items, state.totals);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.coupons = [];
      state.totals = initialTotals;
      state.itemsCount = 0;
      state.cartHash = '';
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  setCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  setLoading,
  setError,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;