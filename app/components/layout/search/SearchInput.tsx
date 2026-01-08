'use client';

import { useRef, useEffect } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useSearch } from '@/lib/hooks/useSearch';

export function SearchInput() {
  const { query, isSearching, handleSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex-1 relative">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for products..."
        className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emperador focus:border-transparent text-lg"
      />
      {isSearching && (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emperador animate-spin" />
      )}
    </div>
  );
}
