'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { toggleFilterSidebar } from '@/lib/redux/slices/filterSidebarSlice';
import { X } from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import { useFilterOptions } from '@/lib/hooks/useFilterOptions';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getCollectionMaterialSlug } from '@/lib/utils/url-mapping';

export function FilterSidebar() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.filterSidebar.isOpen);
  const { filterOptions, isLoading } = useFilterOptions();
  const pathname = usePathname();

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

  // Filter states
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedUsageAreas, setSelectedUsageAreas] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([]);

  // Update selected materials when locked material slug changes (page navigation)
  useEffect(() => {
    if (lockedMaterialSlug) {
      setSelectedMaterials([lockedMaterialSlug]);
    } else {
      setSelectedMaterials([]);
    }
  }, [lockedMaterialSlug]);

  const closeSidebar = () => {
    dispatch(toggleFilterSidebar());
  };

  const handleClearFilters = () => {
    // Don't clear locked material filter
    if (!lockedMaterialSlug) {
      setSelectedMaterials([]);
    }
    setSelectedUsageAreas([]);
    setSelectedColours([]);
    setSelectedFinishes([]);
  };

  const handleApplyFilters = () => {
    // TODO: Apply filters to product list
    console.log('Applying filters:', {
      materials: selectedMaterials,
      usageAreas: selectedUsageAreas,
      colours: selectedColours,
      finishes: selectedFinishes,
    });
    closeSidebar();
  };

  // Toggle handlers
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
            onToggleMaterial={toggleMaterial}
            onToggleUsageArea={toggleUsageArea}
            onToggleColour={toggleColour}
            onToggleFinish={toggleFinish}
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