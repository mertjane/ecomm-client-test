'use client';

import { use, useState } from 'react';
import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';
import { CategoryHeader } from '@/app/components/layout/category-header';
import { ProductGrid, LoadMoreButton } from '@/app/components/layout/product-grid';
import { useProducts } from '@/lib/hooks/useProducts';
import { getCollectionTitle, getCollectionType } from '@/lib/utils/url-mapping';
import ProductActionsBar from '@/app/components/layout/product-actions/ProductActionsBar';
import type { SortOption } from '@/types/product';

interface StoneCollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default function StoneCollectionPage({ params }: StoneCollectionPageProps) {
  const { slug } = use(params);
  const collectionType = getCollectionType(slug);
  const title = getCollectionTitle(slug);
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
    { label: 'Stone Collection', href: '/collections/stone-collection' },
    { label: title },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />
      <CategoryHeader title={title} description="Explore our collection" />
      <ProductActionsBar
        totalProducts={meta?.total_products || 0}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-muted aspect-square rounded-lg" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <>
            <ProductGrid products={products} />

            {hasNextPage && meta &&(
              <div className="mt-12 flex justify-center">
                <LoadMoreButton
                  currentPage={meta.current_page}   
                  totalPages={meta.total_pages}
                  isLoading={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}