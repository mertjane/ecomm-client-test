import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterSidebarStates {
    isOpen: boolean;
}

const initialState: FilterSidebarStates = {
  isOpen: false,
};


const filterSidebarSlice = createSlice({
    name: 'filterSidebar',
    initialState,
    reducers: {
        toggleFilterSidebar: (state) => {
            state.isOpen = !state.isOpen
        }
    }
})

export const {
    toggleFilterSidebar
} = filterSidebarSlice.actions;

export default filterSidebarSlice.reducer;