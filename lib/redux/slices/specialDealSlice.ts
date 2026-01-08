import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpecialDealState, SpecialDeal } from '@/types/special-deals';

const initialState: SpecialDealState = {
  data: null,
  isLoading: false,
  error: null,
};

const specialDealSlice = createSlice({
  name: 'special-deals',
  initialState,
  reducers: {
    setSpecialDealData: (state, action: PayloadAction<SpecialDeal[]>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSpecialDealLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSpecialDealError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setSpecialDealData, setSpecialDealLoading, setSpecialDealError } =
  specialDealSlice.actions;
export default specialDealSlice.reducer;