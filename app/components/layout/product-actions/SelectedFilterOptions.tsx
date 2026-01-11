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
    {/* 1. Relative wrapper to position the fade overlay */}
    <div className="relative"> 
      
      <div 
        className="
          flex items-center gap-2 
          overflow-x-auto flex-nowrap 
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          /* 2. Added padding-right (pr-12) so the last item scrolls fully into view past the fade */
          pr-12 
        "
      >
        {filters.map((filter) => (
          <div
            key={`${filter.type}-${filter.slug}`}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter.locked
                ? 'bg-emperador/10 text-emperador border border-emperador/20'
                : 'bg-emperador/10 text-emperador hover:bg-muted border border-emperador/20'
            }`}
          >
            <span className="whitespace-nowrap">{filter.name}</span>
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

      {/* 3. The Fade Overlay */}
      <div 
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" 
        aria-hidden="true"
      />
      
    </div>
  </div>
</div>
  );
}