'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { usePopularProducts } from '@/lib/hooks/usePopularProducts';
import { useSearch } from '@/lib/hooks/useSearch';
import { parsePriceFromHtml, formatPrice } from '@/lib/utils/price';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';

function PopularProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const price = parsePriceFromHtml(product.price_html);
  const imageUrl = product.images[0]?.src || product.yoast_head_json?.og_image[0]?.url;

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={onClick}
      className="group block bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px]"
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
      <div className="p-2.5 sm:p-3 md:p-4">
        <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mb-1.5 sm:mb-2 min-h-[32px] sm:min-h-[36px] md:min-h-[40px] group-hover:text-emperador transition-colors">
          {product.name}
        </h3>
        <p className="text-base sm:text-lg font-semibold text-emperador">
          {formatPrice(price)}
        </p>
        {product.categories.length > 0 && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-1">
            {product.categories[0].name}
          </p>
        )}
      </div>
    </Link>
  );
}

export function PopularProducts() {
  const { data: products, isLoading, error } = usePopularProducts();
  const { closeSearch } = useSearch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === 'right' ? scrollAmount : -scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-emperador animate-spin mb-4" />
        <p className="text-muted-foreground">Loading popular products...</p>
      </div>
    );
  }

  if (error) {
    console.error('Popular Products Error:', error);
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-2">Failed to load popular products</p>
        <p className="text-muted-foreground text-sm">
          {error instanceof Error ? error.message : 'Please try again later'}
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base sm:text-lg font-semibold uppercase tracking-wide">
          Popular Products
        </h3>
        <div className="hidden sm:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="h-8 w-8"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="h-8 w-8"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-3 sm:pb-4 scroll-smooth -mx-1 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {products.map((product) => (
          <PopularProductCard key={product.id} product={product} onClick={closeSearch} />
        ))}
      </div>
    </div>
  );
}