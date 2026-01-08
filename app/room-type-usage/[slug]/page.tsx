'use client';

import { useState, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';
import { CategoryHeader } from '@/app/components/layout/category-header';
import { ProductActionsBar } from '@/app/components/layout/product-actions';
import { ProductGrid, LoadMoreButton } from '@/app/components/layout/product-grid';
import { useProducts } from '@/lib/hooks/useProducts';
//import { productsApi } from '@/lib/api/products';
import { getCollectionTitle } from '@/lib/utils/url-mapping';
import { getRelatedRoomTypes } from '@/lib/utils/room-type-mapping';
//import type { SortOption, SelectedFilters } from '@/types/product';

interface RoomTypeUsagePageProps {
  params: Promise<{ slug: string }>;
}

export default function RoomTypeUsagePage({ params }: RoomTypeUsagePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  // Get all related room types (e.g., bathroom -> [bathroom-floor, bathroom-wall])
  const relatedRoomTypes = getRelatedRoomTypes(slug);

  // const [sortBy, setSortBy] = useState<SortOption>('date');
  // const [filters, setFilters] = useState<SelectedFilters>({
  //   roomType: relatedRoomTypes, // Pre-select all related room types
  // });

  // Fetch filter options
  // const { data: filterOptions, isLoading: isLoadingOptions } = useQuery({
  //   queryKey: ['filterOptions'],
  //   queryFn: productsApi.fetchFilterOptions,
  //   staleTime: 1000 * 60 * 60,
  // });

  // const { products, meta, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  //   useProducts({
  //     per_page: 12,
  //     sort: sortBy,
  //     filters,
  //   });

  const title = getCollectionTitle(slug);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Usage Areas', href: '/room-type-usage' },
    { label: title },
  ];

  // const handleFilterChange = (filterType: keyof SelectedFilters, value: string) => {
  //   // Prevent removing related room type filters
  //   if (filterType === 'roomType' && relatedRoomTypes.includes(value)) {
  //     return;
  //   }

  //   setFilters((prev) => {
  //     const currentValues = prev[filterType] || [];
  //     const newValues = currentValues.includes(value)
  //       ? currentValues.filter((v) => v !== value)
  //       : [...currentValues, value];

  //     return {
  //       ...prev,
  //       [filterType]: newValues.length > 0 ? newValues : undefined,
  //     };
  //   });
  // };

  // const clearAllFilters = () => {
  //   setFilters({ roomType: relatedRoomTypes }); // Keep related room types pre-selected
  // };

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />
      <CategoryHeader title={title} description={`Perfect stone solutions for your ${title.toLowerCase()}`} />

      {/* <ProductActionsBar
        totalProducts={meta?.total_products || 0}
        sortBy={sortBy}
        filters={filters}
        filterOptions={filterOptions}
        isLoadingOptions={isLoadingOptions}
        onSortChange={setSortBy}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
      /> */}

      {/* <div className="container mx-auto px-4 py-12">
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
            <button onClick={clearAllFilters} className="mt-4 text-emperador hover:underline">
              Clear all filters
            </button>
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
      </div> */}
    </div>
  );
}
