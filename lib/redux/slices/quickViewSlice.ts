import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/product';

interface QuickViewState {
  isOpen: boolean;
  product: Product | null;
}

const initialState: QuickViewState = {
  isOpen: false,
  product: null,
};

const quickViewSlice = createSlice({
  name: 'quickView',
  initialState,
  reducers: {
    openQuickView: (state, action: PayloadAction<Product>) => {
      state.isOpen = true;
      state.product = action.payload;
    },
    closeQuickView: (state) => {
      state.isOpen = false;
      state.product = null;
    },
  },
});

export const { openQuickView, closeQuickView } = quickViewSlice.actions;
export default quickViewSlice.reducer;
