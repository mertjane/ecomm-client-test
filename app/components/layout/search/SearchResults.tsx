'use client';

import Link from 'next/link';
import { useSearch } from '@/lib/hooks/useSearch';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parsePriceFromHtml, formatPrice } from '@/lib/utils/price';
import type { Product } from '@/types/product';

function SearchProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const price = parsePriceFromHtml(product.price_html);
  const imageUrl = product.images[0]?.src || product.yoast_head_json?.og_image[0]?.url;

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={onClick}
      className="group block bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="aspect-square relative bg-muted overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {product.stock_status === 'outofstock' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-emperador transition-colors">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-emperador">
          {formatPrice(price)}
        </p>
      </div>
    </Link>
  );
}

export function SearchResults() {
  const {
    results = [],
    query,
    isSearching,
    hasSearched,
    totalResults,
    currentPage,
    totalPages,
    error,
    loadMore,
    closeSearch,
  } = useSearch();

  // Show loading only when actively searching with no results yet
  if (isSearching && (!results || results.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-emperador animate-spin mb-4" />
        <p className="text-muted-foreground">Searching for "{query}"...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-2">Error</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Show "no results" only if search has completed and returned nothing
  if (hasSearched && (!results || results.length === 0) && query.length >= 3 && !isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium mb-2">No results found</p>
        <p className="text-muted-foreground">
          We couldn't find any products matching "{query}"
        </p>
      </div>
    );
  }

  // Don't show anything if no search has been performed or no results
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold uppercase tracking-wide">
          {totalResults} {totalResults === 1 ? 'result' : 'results'} for "{query}"
        </h2>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((product) => (
          <SearchProductCard key={product.id} product={product} onClick={closeSearch} />
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
