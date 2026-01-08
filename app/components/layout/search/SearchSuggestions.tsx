'use client';

import Link from 'next/link';
import { Tag, ArrowRight } from 'lucide-react';
import { useSearch } from '@/lib/hooks/useSearch';

export function SearchSuggestions() {
  const { suggestions, closeSearch } = useSearch();

  if (!suggestions || (!suggestions.products.length && !suggestions.categories.length)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Category Suggestions */}
      {suggestions.categories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={closeSearch}
                className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-emperador hover:text-white rounded-full text-sm transition-colors"
              >
                <Tag className="w-4 h-4" />
                <span>{category.name}</span>
                <span className="text-xs opacity-70">({category.count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Product Suggestions */}
      {suggestions.products.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Suggested Products
          </h3>
          <div className="space-y-2">
            {suggestions.products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={closeSearch}
                className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors group"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded bg-muted"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1 group-hover:text-emperador transition-colors">
                    {product.name}
                  </p>
                  <div
                    className="text-xs text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.price_html }}
                  />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emperador transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
