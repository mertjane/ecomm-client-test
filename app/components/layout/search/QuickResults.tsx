'use client';

import Link from 'next/link';
import { useSearch } from '@/lib/hooks/useSearch';
import { Loader2 } from 'lucide-react';
import { parsePriceFromHtml, formatPrice } from '@/lib/utils/price';

export function QuickResults() {
  const { quickResults = [], isSearching, query, closeSearch } = useSearch();

  // Show loading state
  if (isSearching && (!quickResults || quickResults.length === 0)) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 text-emperador animate-spin" />
      </div>
    );
  }

  // Don't show anything if no results yet
  if (!quickResults || quickResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground px-1">
        Quick Results for "{query}"
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {quickResults.map((product) => {
          const price = parsePriceFromHtml(product.price_html);
          const imageUrl = product.images[0]?.src || product.yoast_head_json?.og_image[0]?.url;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={closeSearch}
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
                    <span className="bg-destructive text-destructive-foreground px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2.5 sm:p-4">
                <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1 sm:mb-2 min-h-[32px] sm:min-h-[40px] group-hover:text-emperador transition-colors">
                  {product.name}
                </h3>
                <p className="text-base sm:text-lg font-semibold text-emperador">
                  {formatPrice(price)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}