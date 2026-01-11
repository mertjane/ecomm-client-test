import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductFilterState {
  selectedMaterials: string[];
  selectedUsageAreas: string[];
  selectedColours: string[];
  selectedFinishes: string[];
}

const initialState: ProductFilterState = {
  selectedMaterials: [],
  selectedUsageAreas: [],
  selectedColours: [],
  selectedFinishes: [],
};

const productFilterSlice = createSlice({
  name: 'productFilter',
  initialState,
  reducers: {
    setMaterials: (state, action: PayloadAction<string[]>) => {
      state.selectedMaterials = action.payload;
    },
    toggleMaterial: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      if (state.selectedMaterials.includes(slug)) {
        state.selectedMaterials = state.selectedMaterials.filter(s => s !== slug);
      } else {
        state.selectedMaterials.push(slug);
      }
    },
    toggleUsageArea: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      if (state.selectedUsageAreas.includes(slug)) {
        state.selectedUsageAreas = state.selectedUsageAreas.filter(s => s !== slug);
      } else {
        state.selectedUsageAreas.push(slug);
      }
    },
    toggleColour: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      if (state.selectedColours.includes(slug)) {
        state.selectedColours = state.selectedColours.filter(s => s !== slug);
      } else {
        state.selectedColours.push(slug);
      }
    },
    toggleFinish: (state, action: PayloadAction<string>) => {
      const slug = action.payload;
      if (state.selectedFinishes.includes(slug)) {
        state.selectedFinishes = state.selectedFinishes.filter(s => s !== slug);
      } else {
        state.selectedFinishes.push(slug);
      }
    },
    clearFilters: (state, action: PayloadAction<{ keepMaterials?: boolean }>) => {
      if (!action.payload?.keepMaterials) {
        state.selectedMaterials = [];
      }
      state.selectedUsageAreas = [];
      state.selectedColours = [];
      state.selectedFinishes = [];
    },
    removeFilter: (state, action: PayloadAction<{ type: string; slug: string }>) => {
      const { type, slug } = action.payload;
      switch (type) {
        case 'material':
          state.selectedMaterials = state.selectedMaterials.filter(s => s !== slug);
          break;
        case 'usage-area':
          state.selectedUsageAreas = state.selectedUsageAreas.filter(s => s !== slug);
          break;
        case 'colour':
          state.selectedColours = state.selectedColours.filter(s => s !== slug);
          break;
        case 'finish':
          state.selectedFinishes = state.selectedFinishes.filter(s => s !== slug);
          break;
      }
    },
  },
});

export const {
  setMaterials,
  toggleMaterial,
  toggleUsageArea,
  toggleColour,
  toggleFinish,
  clearFilters,
  removeFilter,
} = productFilterSlice.actions;

export default productFilterSlice.reducer;