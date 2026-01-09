'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { FilterOption } from '@/types/product';

interface FilterButtonProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (slug: string) => void;
}

export function FilterButton({
  label,
  options,
  selectedValues,
  onToggle,
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            {options.map((option) => {
              const isChecked = selectedValues.includes(option.slug);
              return (
                <label
                  key={option.id}
                  className={`flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer hover:bg-muted/50 ${
                    isChecked ? 'bg-muted/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggle(option.slug)}
                      className="h-4 w-4 rounded border-border text-emperador focus:ring-emperador focus:ring-offset-0"
                    />
                    <span className="text-sm text-foreground">{option.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">({option.count})</span>
                </label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}