'use client';

import { ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { FilterOption, FilterOptions } from '@/types/product';

interface SidebarContentProps {
  filterOptions: FilterOptions | null;
  filteredMaterialOptions: FilterOption[] | null;
  isLoading: boolean;
  selectedMaterials: string[];
  selectedUsageAreas: string[];
  selectedColours: string[];
  selectedFinishes: string[];
  onToggleMaterial: (slug: string) => void;
  onToggleUsageArea: (slug: string) => void;
  onToggleColour: (slug: string) => void;
  onToggleFinish: (slug: string) => void;
  lockedMaterialSlug?: string;
}

interface FilterAccordionProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (slug: string) => void;
  lockedSlug?: string;
}

function FilterAccordion({ label, options, selectedValues, onToggle, lockedSlug }: FilterAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-medium text-foreground uppercase tracking-wide">
          {label}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {options.map((option) => {
            const isChecked = selectedValues.includes(option.slug);
            const isLocked = lockedSlug === option.slug;

            return (
              <label
                key={option.id}
                className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                  isLocked
                    ? 'bg-emperador/10 cursor-not-allowed'
                    : 'cursor-pointer hover:bg-muted/50'
                } ${isChecked && !isLocked ? 'bg-muted/30' : ''}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => !isLocked && onToggle(option.slug)}
                    disabled={isLocked}
                    className={`h-4 w-4 rounded border-border focus:ring-emperador focus:ring-offset-0 ${
                      isLocked
                        ? 'text-emperador cursor-not-allowed opacity-60'
                        : 'text-emperador'
                    }`}
                  />
                  <span className={`text-sm ${isLocked ? 'text-emperador font-medium' : 'text-foreground'}`}>
                    {option.name}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground ml-2">({option.count})</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function SidebarContent({
  filterOptions,
  filteredMaterialOptions,
  isLoading,
  selectedMaterials,
  selectedUsageAreas,
  selectedColours,
  selectedFinishes,
  onToggleMaterial,
  onToggleUsageArea,
  onToggleColour,
  onToggleFinish,
  lockedMaterialSlug,
}: SidebarContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-emperador" />
          <span className="text-sm text-muted-foreground">Loading filters...</span>
        </div>
      </div>
    );
  }

  if (!filterOptions) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-destructive">Failed to load filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Material Filter - Show only locked material if locked, otherwise show all */}
      {filteredMaterialOptions && filteredMaterialOptions.length > 0 && (
        <FilterAccordion
          label="Material"
          options={
            lockedMaterialSlug
              ? filteredMaterialOptions.filter(opt => opt.slug === lockedMaterialSlug)
              : filteredMaterialOptions
          }
          selectedValues={selectedMaterials}
          onToggle={onToggleMaterial}
          lockedSlug={lockedMaterialSlug}
        />
      )}

      {/* Usage Areas Filter */}
      {filterOptions['pa_room-type-usage'] && filterOptions['pa_room-type-usage'].length > 0 && (
        <FilterAccordion
          label="Usage Areas"
          options={filterOptions['pa_room-type-usage']}
          selectedValues={selectedUsageAreas}
          onToggle={onToggleUsageArea}
        />
      )}

      {/* Colour Filter */}
      {filterOptions.pa_colour && filterOptions.pa_colour.length > 0 && (
        <FilterAccordion
          label="Colour"
          options={filterOptions.pa_colour}
          selectedValues={selectedColours}
          onToggle={onToggleColour}
        />
      )}

      {/* Finish Filter */}
      {filterOptions.pa_finish && filterOptions.pa_finish.length > 0 && (
        <FilterAccordion
          label="Finish"
          options={filterOptions.pa_finish}
          selectedValues={selectedFinishes}
          onToggle={onToggleFinish}
        />
      )}
    </div>
  );
}