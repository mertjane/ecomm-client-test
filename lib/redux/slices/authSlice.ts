import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  billing?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    postcode?: string;
    country?: string;
    state?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    first_name?: string;
    last_name?: string;
    company?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    postcode?: string;
    country?: string;
    state?: string;
  };
  avatar_url?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    loginSuccess: (state, action: PayloadAction<{ user: User; rememberMe: boolean }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.rememberMe = action.payload.rememberMe;
      state.isLoading = false;
      state.error = null;
    },

    signupSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.rememberMe = false;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  signupSuccess,
  logout,
  updateUser,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
