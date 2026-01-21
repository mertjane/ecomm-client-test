'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FilterOption } from '@/types/product';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterButtonProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (slug: string) => void;
  isMaterialFilter?: boolean;
  lockedSlug?: string;
}

export function FilterButton({
  label,
  options,
  selectedValues,
  onToggle,
  isMaterialFilter = false,
  lockedSlug,
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Filter options to show only the locked option if lockedSlug is provided
  const displayOptions = lockedSlug
    ? options.filter(option => option.slug === lockedSlug)
    : options;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 sm:px-4 py-2 border border-border bg-background text-foreground uppercase tracking-wide text-xs sm:text-sm font-medium hover:bg-muted/80 transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
      >
        {label}
        <ChevronDown
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={1.5}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 w-56 sm:w-64 bg-background border border-border shadow-lg z-[101] max-h-80 overflow-y-auto rounded-md">
            {displayOptions.map((option) => {
              const isChecked = selectedValues.includes(option.slug);
              const isLocked = lockedSlug === option.slug;

              const handleClick = () => {
                // If locked, don't allow any action
                if (isLocked) {
                  return;
                }

                if (isMaterialFilter) {
                  // Navigate to stone collection page
                  router.push(`/collections/stone-collection/${option.slug}`);
                  setIsOpen(false);
                } else {
                  onToggle(option.slug);
                }
              };

              return (
                <Label
                  key={option.id}
                  className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                    isLocked
                      ? 'bg-emperador/10 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-muted/50'
                  } ${isChecked && !isLocked ? 'bg-muted/30' : ''}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={handleClick}
                      disabled={isLocked}
                    />
                    <span className={`text-sm ${isLocked ? 'text-emperador font-medium' : 'text-foreground'}`}>
                      {option.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">({option.count})</span>
                </Label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}