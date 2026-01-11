'use client';

import { use, useState } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';
import { CategoryHeader } from '@/app/components/layout/category-header';
import { ProductGrid, LoadMoreButton } from '@/app/components/layout/product-grid';
import { useProducts } from '@/lib/hooks/useProducts';
import { useFilteredProducts } from '@/lib/hooks/useFilteredProducts';
import { getCollectionTitle, getCollectionType } from '@/lib/utils/url-mapping';
import ProductActionsBar from '@/app/components/layout/product-actions/ProductActionsBar';
import { RootState } from '@/lib/redux/store';
import type { SortOption } from '@/types/product';

interface StoneCollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default function StoneCollectionPage({ params }: StoneCollectionPageProps) {
  const { slug } = use(params);
  const collectionType = getCollectionType(slug);
  const title = getCollectionTitle(slug);
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Get filter state from Redux
  const selectedUsageAreas = useSelector((state: RootState) => state.productFilter.selectedUsageAreas);
  const selectedColours = useSelector((state: RootState) => state.productFilter.selectedColours);
  const selectedFinishes = useSelector((state: RootState) => state.productFilter.selectedFinishes);

  // Check if any filters are active (material is always locked to slug on this page)
  const hasActiveFilters =
    selectedUsageAreas.length > 0 ||
    selectedColours.length > 0 ||
    selectedFinishes.length > 0;

  // Use filtered products when filters are active
  const filteredProductsQuery = useFilteredProducts({
    material: [slug], // Always include the material slug
    roomTypeUsage: selectedUsageAreas,
    colour: selectedColours,
    finish: selectedFinishes,
    per_page: 12,
    sortBy,
  });

  // Use regular products when no filters are active
  const regularProductsQuery = useProducts({
    slug,
    type: collectionType,
    per_page: 12,
    sortBy,
  });

  // Choose which query to use based on active filters
  const { products, meta, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = hasActiveFilters
    ? filteredProductsQuery
    : regularProductsQuery;

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
        lockedMaterialSlug={slug}
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