'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2, SlidersHorizontal} from 'lucide-react';
import { FilterButton } from './FilterButton';
import { SortDropdown } from './SortDropdown';
import { SelectedFilterOptions, type SelectedFilter } from './SelectedFilterOptions';
import { useFilterOptions } from '@/lib/hooks/useFilterOptions';
import { toggleFilterSidebar } from '@/lib/redux/slices/filterSidebarSlice';
import {
  setMaterials,
  toggleMaterial,
  toggleUsageArea,
  toggleColour,
  toggleFinish,
  removeFilter,
} from '@/lib/redux/slices/productFilterSlice';
import { RootState } from '@/lib/redux/store';
import type { SortOption } from '@/types/product';

interface ProductActionsBarProps {
  totalProducts?: number;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  lockedMaterialSlug?: string;
}

const ProductActionsBar = ({ totalProducts = 0, sortBy, onSortChange, lockedMaterialSlug }: ProductActionsBarProps) => {
  const dispatch = useDispatch();
  const { filterOptions, isLoading, isError } = useFilterOptions();

  // Get filter state from Redux
  const selectedMaterials = useSelector((state: RootState) => state.productFilter.selectedMaterials);
  const selectedUsageAreas = useSelector((state: RootState) => state.productFilter.selectedUsageAreas);
  const selectedColours = useSelector((state: RootState) => state.productFilter.selectedColours);
  const selectedFinishes = useSelector((state: RootState) => state.productFilter.selectedFinishes);

  // Filter out Porcelain tiles from material options
  const filteredMaterialOptions = filterOptions?.pa_material?.filter(
    option => option.slug !== 'porcelain-stone'
  );

  // Set locked material on mount or when it changes
  useEffect(() => {
    if (lockedMaterialSlug) {
      dispatch(setMaterials([lockedMaterialSlug]));
    }
  }, [lockedMaterialSlug, dispatch]);

  // Toggle handlers dispatch to Redux
  const handleToggleMaterial = (slug: string) => {
    dispatch(toggleMaterial(slug));
  };

  const handleToggleUsageArea = (slug: string) => {
    dispatch(toggleUsageArea(slug));
  };

  const handleToggleColour = (slug: string) => {
    dispatch(toggleColour(slug));
  };

  const handleToggleFinish = (slug: string) => {
    dispatch(toggleFinish(slug));
  };

  // Build selected filters array for chips
  const selectedFilters: SelectedFilter[] = [];

  // Add locked material filter chip
  if (lockedMaterialSlug && filteredMaterialOptions) {
    const materialOption = filteredMaterialOptions.find(opt => opt.slug === lockedMaterialSlug);
    if (materialOption) {
      selectedFilters.push({
        type: 'material',
        slug: lockedMaterialSlug,
        name: materialOption.name,
        locked: true,
      });
    }
  }

  // Add other selected filter chips
  selectedUsageAreas.forEach(slug => {
    const option = filterOptions?.['pa_room-type-usage']?.find(opt => opt.slug === slug);
    if (option) {
      selectedFilters.push({
        type: 'usage-area',
        slug: option.slug,
        name: option.name,
      });
    }
  });

  selectedColours.forEach(slug => {
    const option = filterOptions?.pa_colour?.find(opt => opt.slug === slug);
    if (option) {
      selectedFilters.push({
        type: 'colour',
        slug: option.slug,
        name: option.name,
      });
    }
  });

  selectedFinishes.forEach(slug => {
    const option = filterOptions?.pa_finish?.find(opt => opt.slug === slug);
    if (option) {
      selectedFilters.push({
        type: 'finish',
        slug: option.slug,
        name: option.name,
      });
    }
  });

  // Handle filter removal
  const handleRemoveFilter = (type: string, slug: string) => {
    if (type === 'material' && lockedMaterialSlug) {
      // Don't allow removing locked material
      return;
    }
    dispatch(removeFilter({ type, slug }));
  };

  if (isError) {
    return (
      <div className="w-full bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-destructive">Failed to load filters</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-background border-b border-border sticky top-[var(--header-height)] z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-row sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left Side: Filters */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading filters...</span>
              </div>
            ) : (
              <>
              {/* Mobile Filter */}
              <div
                onClick={() => dispatch(toggleFilterSidebar())}
                className='sm:hidden flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors'
              >
                <span className='text-sm text-muted-foreground'>Filters</span>
                <SlidersHorizontal className='w-4 h-4'/>
              </div>
              {/* Desktop Filter */}
              <div className='sm:flex hidden gap-2'>
                {/* Material Filter */}
                {filteredMaterialOptions && filteredMaterialOptions.length > 0 && (
                  <FilterButton
                    label="Material"
                    options={filteredMaterialOptions}
                    selectedValues={selectedMaterials}
                    onToggle={handleToggleMaterial}
                    isMaterialFilter={true}
                    lockedSlug={lockedMaterialSlug}
                  />
                )}

                {/* Usage Areas Filter */}
                {filterOptions?.['pa_room-type-usage'] && filterOptions['pa_room-type-usage'].length > 0 && (
                  <FilterButton
                    label="Usage Areas"
                    options={filterOptions['pa_room-type-usage']}
                    selectedValues={selectedUsageAreas}
                    onToggle={handleToggleUsageArea}
                  />
                )}

                {/* Colour Filter */}
                {filterOptions?.pa_colour && filterOptions.pa_colour.length > 0 && (
                  <FilterButton
                    label="Colour"
                    options={filterOptions.pa_colour}
                    selectedValues={selectedColours}
                    onToggle={handleToggleColour}
                  />
                )}

                {/* Finish Filter */}
                {filterOptions?.pa_finish && filterOptions.pa_finish.length > 0 && (
                  <FilterButton
                    label="Finish"
                    options={filterOptions.pa_finish}
                    selectedValues={selectedFinishes}
                    onToggle={handleToggleFinish}
                  />
                )}
              </div>
              </>
            )}
          </div>

          {/* Right Side: Product Count & Sort */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            {/* Product Count */}
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              <span className="font-medium text-foreground">{totalProducts}</span> products
            </div>

            {/* Sort Dropdown */}
            <SortDropdown value={sortBy} onChange={onSortChange} />
          </div>
        </div>
        </div>
      </div>

      {/* Selected Filter Options Chips */}
      <SelectedFilterOptions
        filters={selectedFilters}
        onRemove={handleRemoveFilter}
      />
    </>
  );
};

export default ProductActionsBar;
