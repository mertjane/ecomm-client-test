'use client';

import { use, useState } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';
import { CategoryHeader } from '@/app/components/layout/category-header';
import ProductActionsBar from '@/app/components/layout/product-actions/ProductActionsBar';
import { ProductGrid, LoadMoreButton } from '@/app/components/layout/product-grid';
import { useProducts } from '@/lib/hooks/useProducts';
import { useFilteredProducts } from '@/lib/hooks/useFilteredProducts';
import { getCollectionTitle, getCollectionType, getCollectionMaterialSlug } from '@/lib/utils/url-mapping';
import { RootState } from '@/lib/redux/store';
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

  // Get filter state from Redux
  const selectedMaterials = useSelector((state: RootState) => state.productFilter.selectedMaterials);
  const selectedUsageAreas = useSelector((state: RootState) => state.productFilter.selectedUsageAreas);
  const selectedColours = useSelector((state: RootState) => state.productFilter.selectedColours);
  const selectedFinishes = useSelector((state: RootState) => state.productFilter.selectedFinishes);

  // Check if any filters are active (excluding locked material)
  const hasActiveFilters =
    selectedUsageAreas.length > 0 ||
    selectedColours.length > 0 ||
    selectedFinishes.length > 0 ||
    (selectedMaterials.length > 0 && !lockedMaterialSlug);

  // Use filtered products when filters are active
  const filteredProductsQuery = useFilteredProducts({
    material: selectedMaterials,
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
