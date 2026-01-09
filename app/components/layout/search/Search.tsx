'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useSearch } from '@/lib/hooks/useSearch';
import { SearchInput } from './SearchInput';
import { QuickResults } from './QuickResults';
import { PopularProducts } from './PopularProducts';
import { cn } from '@/lib/utils';

export function Search() {
  const { isOpen, query, closeSearch } = useSearch();

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeSearch]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSearch}
      />

      {/* Search Panel - Dropdown from top */}
      <div
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-background shadow-2xl transition-transform duration-500 ease-out flex flex-col',
          'max-h-[95vh] sm:max-h-[90vh]',
          isOpen ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        {/* Header */}
        <div className="border-b border-border p-3 sm:p-4 md:p-6 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex items-center gap-2 sm:gap-4">
            <SearchInput />
            <button
              onClick={closeSearch}
              className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
              aria-label="Close search"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            {query.length < 2 ? (
              // Show popular products when not searching (query < 2 chars)
              <PopularProducts />
            ) : (
              // Show first 6 search results when user types (query >= 2 chars)
              <div className="space-y-6 sm:space-y-8">
                <QuickResults />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}