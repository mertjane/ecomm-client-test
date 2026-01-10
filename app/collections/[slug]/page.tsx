'use client';

import { use, useState } from 'react';
import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';
import { CategoryHeader } from '@/app/components/layout/category-header';
import ProductActionsBar from '@/app/components/layout/product-actions/ProductActionsBar';
import { ProductGrid, LoadMoreButton } from '@/app/components/layout/product-grid';
import { useProducts } from '@/lib/hooks/useProducts';
import { getCollectionTitle, getCollectionType, getCollectionMaterialSlug } from '@/lib/utils/url-mapping';
import type { SortOption } from '@/types/product';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = use(params);
  const collectionType = getCollectionType(slug);
  const title = getCollectionTitle(slug);
  const lockedMaterialSlug = getCollectionMaterialSlug(slug);
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const { products, meta, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useProducts({
      slug,
      type: collectionType,
      per_page: 12,
      sortBy
    });

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: title },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />
      <CategoryHeader title={title} description={`Explore our ${title.toLowerCase()} collection`} />
      <ProductActionsBar
        totalProducts={meta?.total_products || 0}
        sortBy={sortBy}
        onSortChange={setSortBy}
        lockedMaterialSlug={lockedMaterialSlug}
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
              No products found matching your filters.
            </p>
            {/* <button onClick={clearAllFilters} className="mt-4 text-emperador hover:underline">
              Clear all filters
            </button> */}
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
