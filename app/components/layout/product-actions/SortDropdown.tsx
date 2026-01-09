'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { SortOption } from '@/types/product';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date', label: 'Latest' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'title', label: 'Name (A-Z)' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel =
    sortOptions.find((opt) => opt.value === value)?.label || 'Latest';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-border bg-background text-foreground uppercase tracking-wide text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2 min-w-[180px] justify-between"
      >
        <span className="text-muted-foreground text-xs">Sort By:</span>
        <span>{currentLabel}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
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
          <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border shadow-lg z-[101]">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors text-sm ${
                  value === option.value
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}