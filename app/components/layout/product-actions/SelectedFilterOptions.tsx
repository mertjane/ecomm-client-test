'use client';

import { X } from 'lucide-react';

export interface SelectedFilter {
  type: 'material' | 'usage-area' | 'colour' | 'finish';
  slug: string;
  name: string;
  locked?: boolean;
}

interface SelectedFilterOptionsProps {
  filters: SelectedFilter[];
  onRemove: (type: string, slug: string) => void;
}

export function SelectedFilterOptions({ filters, onRemove }: SelectedFilterOptionsProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Filters:
          </span>
          {filters.map((filter) => (
            <div
              key={`${filter.type}-${filter.slug}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter.locked
                  ? 'bg-emperador/10 text-emperador border border-emperador/20'
                  : 'bg-muted/80 text-foreground hover:bg-muted'
              }`}
            >
              <span>{filter.name}</span>
              {!filter.locked && (
                <button
                  onClick={() => onRemove(filter.type, filter.slug)}
                  className="hover:bg-background/50 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${filter.name} filter`}
                >
                  <X className="w-3 h-3" strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}