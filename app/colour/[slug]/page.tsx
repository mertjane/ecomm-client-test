'use client';

import { use, useState } from 'react';
import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';
import { CategoryHeader } from '@/app/components/layout/category-header';
import ProductActionsBar from '@/app/components/layout/product-actions/ProductActionsBar';
import { ProductGrid, LoadMoreButton } from '@/app/components/layout/product-grid';
import { useFilteredProducts } from '@/lib/hooks/useFilteredProducts';
import { getRelatedColours, getColourGroupName } from '@/lib/utils/colour-mapping';
import type { SortOption } from '@/types/product';

interface ColourPageProps {
  params: Promise<{ slug: string }>;
}

export default function ColourPage({ params }: ColourPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  // Get all related colours (e.g., whites -> [white, ivory-cream, ivory])
  const relatedColours = getRelatedColours(slug);

  // State for sorting
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Fetch filtered products based on colour group
  const { products, meta, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFilteredProducts({
      colour: relatedColours,
      per_page: 12,
      sortBy,
    });

  const title = getColourGroupName(slug);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Stone Colours', href: '/colour' },
    { label: title },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />
      <CategoryHeader title={title} description="Discover our stone colour collection" />

      <ProductActionsBar
        totalProducts={meta?.total_products || 0}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted mb-4" />
                <div className="h-4 bg-muted mb-2 w-3/4" />
                <div className="h-4 bg-muted w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No products found in this colour.
            </p>
          </div>
        ) : (
          <>
            <ProductGrid products={products} />
            {meta && hasNextPage && (
              <LoadMoreButton
                currentPage={meta.current_page}
                totalPages={meta.total_pages}
                isLoading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
