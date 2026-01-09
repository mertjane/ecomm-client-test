import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PLACEHOLDER_IMAGE } from '@/lib/constants/images';

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  regular_price?: number;
  sale_price?: number;
  quantity: number;
  image: string;
  stock_status: string;
  price_html?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { itemCount, total };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);

      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }

      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
    },

    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
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

    // For testing/demo: load mockup data
    loadMockupData: (state) => {
      state.items = [
        {
          id: 1,
          name: 'Premium Marble Tile',
          slug: 'premium-marble-tile',
          price: 45.99,
          regular_price: 59.99,
          sale_price: 45.99,
          quantity: 2,
          image: PLACEHOLDER_IMAGE,
          stock_status: 'instock',
          price_html: '<span class="price">£45.99</span> / m²',
        },
        {
          id: 2,
          name: 'Oak Wood Flooring',
          slug: 'oak-wood-flooring',
          price: 89.99,
          quantity: 1,
          image: PLACEHOLDER_IMAGE,
          stock_status: 'instock',
          price_html: '<span class="price">£89.99</span> / m²',
        },
        {
          id: 3,
          name: 'Ceramic Wall Tiles',
          slug: 'ceramic-wall-tiles',
          price: 25.50,
          regular_price: 35.00,
          sale_price: 25.50,
          quantity: 3,
          image: PLACEHOLDER_IMAGE,
          stock_status: 'instock',
          price_html: '<span class="price">£25.50</span> / m²',
        },
      ];

      const totals = calculateTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  loadMockupData,
} = cartSlice.actions;

export default cartSlice.reducer;