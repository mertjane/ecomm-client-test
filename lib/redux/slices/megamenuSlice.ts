import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MegamenuState, MegamenuItem } from '@/types/megamenu';

const initialState: MegamenuState = {
  isLoading: false,
  error: null,
  data: [],
};

const megamenuSlice = createSlice({
  name: 'megamenu',
  initialState,
  reducers: {
    // Set the full menu data
    setMegamenuData: (state, action: PayloadAction<MegamenuItem[]>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Toggle loading state
    setMegamenuLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setMegamenuError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Optional: clear menu
    clearMegamenu: (state) => {
      state.data = [];
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setMegamenuData,
  setMegamenuLoading,
  setMegamenuError,
  clearMegamenu,
} = megamenuSlice.actions;

export default megamenuSlice.reducer;
