'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FilterButton } from './FilterButton';
import { SortDropdown } from './SortDropdown';
import { useFilterOptions } from '@/lib/hooks/useFilterOptions';
import type { SortOption } from '@/types/product';

interface ProductActionsBarProps {
  totalProducts?: number;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

const ProductActionsBar = ({ totalProducts = 0, sortBy, onSortChange }: ProductActionsBarProps) => {
  const { filterOptions, isLoading, isError } = useFilterOptions();

  // Filter states (will be used for actual filtering later)
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedUsageAreas, setSelectedUsageAreas] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);

  // Toggle handlers for each filter
  const toggleMaterial = (slug: string) => {
    setSelectedMaterials(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const toggleUsageArea = (slug: string) => {
    setSelectedUsageAreas(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const toggleColour = (slug: string) => {
    setSelectedColours(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const toggleFinish = (slug: string) => {
    setSelectedFinishes(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
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
    <div className="w-full bg-background border-b border-border sticky top-[var(--header-height)] z-40">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* Left Side: Filters */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading filters...</span>
              </div>
            ) : (
              <>
                {/* Material Filter */}
                {filterOptions?.pa_material && filterOptions.pa_material.length > 0 && (
                  <FilterButton
                    label="Material"
                    options={filterOptions.pa_material}
                    selectedValues={selectedMaterials}
                    onToggle={toggleMaterial}
                  />
                )}

                {/* Usage Areas Filter */}
                {filterOptions?.['pa_room-type-usage'] && filterOptions['pa_room-type-usage'].length > 0 && (
                  <FilterButton
                    label="Usage Areas"
                    options={filterOptions['pa_room-type-usage']}
                    selectedValues={selectedUsageAreas}
                    onToggle={toggleUsageArea}
                  />
                )}

                {/* Colour Filter */}
                {filterOptions?.pa_colour && filterOptions.pa_colour.length > 0 && (
                  <FilterButton
                    label="Colour"
                    options={filterOptions.pa_colour}
                    selectedValues={selectedColours}
                    onToggle={toggleColour}
                  />
                )}

                {/* Finish Filter */}
                {filterOptions?.pa_finish && filterOptions.pa_finish.length > 0 && (
                  <FilterButton
                    label="Finish"
                    options={filterOptions.pa_finish}
                    selectedValues={selectedFinishes}
                    onToggle={toggleFinish}
                  />
                )}
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
  );
};

export default ProductActionsBar;
