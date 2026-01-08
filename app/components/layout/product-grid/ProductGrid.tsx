'use client';

import { ProductCard } from './ProductCard';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="w-full py-16 text-center">
        <p className="text-muted-foreground text-lg">
          No products found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4}/>
      ))}
    </div>
  );
}