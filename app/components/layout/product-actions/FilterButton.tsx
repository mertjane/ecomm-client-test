'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FilterButtonProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  lockedValue?: string; // Locked option that appears checked and disabled
}

export function FilterButton({
  label,
  options,
  selectedValues,
  onToggle,
  lockedValue,
}: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If there's a locked value, only show that option
  const displayOptions = lockedValue ? [lockedValue] : options;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-border bg-background text-foreground uppercase tracking-wide text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
      >
        {label}
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
          <div className="absolute left-0 top-full mt-2 w-56 bg-background border border-border shadow-lg z-[101] max-h-80 overflow-y-auto">
            {displayOptions.map((option) => {
              const isLocked = lockedValue === option;
              return (
                <label
                  key={option}
                  className={`flex items-center px-4 py-3 transition-colors ${
                    isLocked ? 'cursor-not-allowed opacity-75' : 'hover:bg-muted cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option) || isLocked}
                    onChange={() => !isLocked && onToggle(option)}
                    disabled={isLocked}
                    className="mr-3 h-4 w-4 border-border text-emperador focus:ring-emperador disabled:opacity-50"
                  />
                  <span className="text-sm text-foreground">{option}</span>
                </label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}