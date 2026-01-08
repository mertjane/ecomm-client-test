import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types/product';

interface SearchSuggestion {
  products: Array<{
    id: number;
    name: string;
    slug: string;
    image: string | null;
    price_html: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    count: number;
  }>;
}

interface SearchState {
  isOpen: boolean;
  query: string;
  results: Product[];
  suggestions: SearchSuggestion | null;
  popularProducts: Product[];
  isSearching: boolean;
  hasSearched: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  error: string | null;
}

const initialState: SearchState = {
  isOpen: false,
  query: '',
  results: [],
  suggestions: null,
  popularProducts: [],
  isSearching: false,
  hasSearched: false,
  totalResults: 0,
  currentPage: 1,
  totalPages: 0,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    openSearch: (state) => {
      state.isOpen = true;
    },

    closeSearch: (state) => {
      state.isOpen = false;
      // Reset search state when closing
      state.query = '';
      state.results = [];
      state.suggestions = null;
      state.hasSearched = false;
      state.error = null;
    },

    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      if (action.payload === '') {
        state.hasSearched = false;
        state.results = [];
        state.suggestions = null;
      }
    },

    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },

    setSearchResults: (
      state,
      action: PayloadAction<{
        results: Product[];
        totalResults: number;
        currentPage: number;
        totalPages: number;
      }>
    ) => {
      state.results = action.payload.results;
      state.totalResults = action.payload.totalResults;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasSearched = true;
      state.isSearching = false;
      state.error = null;
    },

    setSuggestions: (state, action: PayloadAction<SearchSuggestion>) => {
      state.suggestions = action.payload;
    },

    setPopularProducts: (state, action: PayloadAction<Product[]>) => {
      state.popularProducts = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isSearching = false;
    },

    clearResults: (state) => {
      state.results = [];
      state.suggestions = null;
      state.hasSearched = false;
      state.totalResults = 0;
      state.error = null;
    },
  },
});

export const {
  openSearch,
  closeSearch,
  setQuery,
  setSearching,
  setSearchResults,
  setSuggestions,
  setPopularProducts,
  setError,
  clearResults,
} = searchSlice.actions;

export default searchSlice.reducer;
