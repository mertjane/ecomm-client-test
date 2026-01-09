// lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import megamenuReducer from './slices/megamenuSlice';
import specialDealReducer from './slices/specialDealSlice';
import cartReducer from './slices/cartSlice';
import searchReducer from './slices/searchSlice';
import authReducer from './slices/authSlice';
import quickViewReducer from './slices/quickViewSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      megamenu: megamenuReducer,
      specialDeals: specialDealReducer,
      cart: cartReducer,
      search: searchReducer,
      auth: authReducer,
      quickView: quickViewReducer,
    },
  });
};

// Create store instance for non-SSR usage
export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof makeStore>;