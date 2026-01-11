'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { toggleFilterSidebar } from '@/lib/redux/slices/filterSidebarSlice';
import {
  toggleMaterial,
  toggleUsageArea,
  toggleColour,
  toggleFinish,
  clearFilters,
} from '@/lib/redux/slices/productFilterSlice';
import { X } from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import { useFilterOptions } from '@/lib/hooks/useFilterOptions';
import { usePathname } from 'next/navigation';
import { getCollectionMaterialSlug } from '@/lib/utils/url-mapping';

export function FilterSidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.filterSidebar.isOpen);
  const { filterOptions, isLoading } = useFilterOptions();
  const pathname = usePathname();

  // Get filter state from Redux
  const selectedMaterials = useSelector((state: RootState) => state.productFilter.selectedMaterials);
  const selectedUsageAreas = useSelector((state: RootState) => state.productFilter.selectedUsageAreas);
  const selectedColours = useSelector((state: RootState) => state.productFilter.selectedColours);
  const selectedFinishes = useSelector((state: RootState) => state.productFilter.selectedFinishes);

  // Detect locked material slug from URL
  const lockedMaterialSlug = (() => {
    // Check if we're on a stone collection page (/collections/stone-collection/[slug])
    const stoneCollectionMatch = pathname.match(/^\/collections\/stone-collection\/([^\/]+)/);
    if (stoneCollectionMatch) {
      return stoneCollectionMatch[1];
    }

    // Check if we're on a regular collection page with material mapping
    const collectionMatch = pathname.match(/^\/collections\/([^\/]+)/);
    if (collectionMatch) {
      return getCollectionMaterialSlug(collectionMatch[1]);
    }

    return undefined;
  })();

  // Filter out Porcelain Stone from material options
  const filteredMaterialOptions = filterOptions?.pa_material?.filter(
    option => option.slug !== 'porcelain-stone'
  );

  const closeSidebar = () => {
    dispatch(toggleFilterSidebar());
  };

  const handleClearFilters = () => {
    // Keep locked material when clearing
    dispatch(clearFilters({ keepMaterials: !!lockedMaterialSlug }));
  };

  const handleApplyFilters = () => {
    // Close sidebar - filters are already applied via Redux
    closeSidebar();
  };

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

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[200] sm:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-background z-[201] sm:hidden transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto mt-10">
          <SidebarContent
            filterOptions={filterOptions || null}
            filteredMaterialOptions={filteredMaterialOptions || null}
            isLoading={isLoading}
            selectedMaterials={selectedMaterials}
            selectedUsageAreas={selectedUsageAreas}
            selectedColours={selectedColours}
            selectedFinishes={selectedFinishes}
            onToggleMaterial={handleToggleMaterial}
            onToggleUsageArea={handleToggleUsageArea}
            onToggleColour={handleToggleColour}
            onToggleFinish={handleToggleFinish}
            lockedMaterialSlug={lockedMaterialSlug}
          />
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="border-t border-border p-4 bg-background">
          <div className="flex gap-3 w-full">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-3 border border-border bg-background text-foreground uppercase tracking-wide text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-3 bg-emperador text-white uppercase tracking-wide text-sm font-medium hover:bg-emperador/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}