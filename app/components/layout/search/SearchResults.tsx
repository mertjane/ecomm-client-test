'use client';

import { ProductCard } from '../product-grid/ProductCard';
import { useSearch } from '@/lib/hooks/useSearch';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchResults() {
  const {
    results,
    query,
    isSearching,
    totalResults,
    currentPage,
    totalPages,
    error,
    loadMore,
  } = useSearch();

  if (isSearching && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-emperador animate-spin mb-4" />
        <p className="text-muted-foreground">Searching for "{query}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-2">Error</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (results.length === 0 && query.length >= 3) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium mb-2">No results found</p>
        <p className="text-muted-foreground">
          We couldn't find any products matching "{query}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {totalResults} {totalResults === 1 ? 'result' : 'results'} for "{query}"
        </h2>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More */}
      {currentPage < totalPages && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={() => loadMore(currentPage + 1)}
            disabled={isSearching}
            variant="outline"
            size="lg"
            className="uppercase tracking-wide"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
