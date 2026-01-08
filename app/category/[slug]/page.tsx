'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';
import { CategoryHeader } from '@/app/components/layout/category-header';
import { ProductActionsBar } from '@/app/components/layout/product-actions';
import { ProductGrid, LoadMoreButton } from '@/app/components/layout/product-grid';
import { useProducts } from '@/lib/hooks/useProducts';
import { productsApi } from '@/lib/api/products';
import { getCollectionPath } from '@/lib/utils/url-mapping';
import type { SortOption, SelectedFilters } from '@/types/product';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Category metadata
const categoryMetadata: Record<string, { title: string; description: string }> = {
  'marble-tiles': {
    title: 'Marble Tiles',
    description: 'Discover our exquisite collection of marble tiles. Timeless elegance meets modern design in every piece.',
  },
  'limestone-tiles': {
    title: 'Limestone Tiles',
    description: 'Natural limestone tiles that bring warmth and character to any space. Durable and beautiful.',
  },
  'travertine-tiles': {
    title: 'Travertine Tiles',
    description: 'Classic travertine tiles with unique patterns and textures. Perfect for creating stunning interiors.',
  },
  'slate-tiles': {
    title: 'Slate Tiles',
    description: 'Rugged and versatile slate tiles for floors and walls. Natural beauty that lasts generations.',
  },
  'stone-slabs': {
    title: 'Stone Slabs',
    description: 'Premium stone slabs for countertops, vanities, and custom installations. Unmatched quality and elegance.',
  },
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filters, setFilters] = useState<SelectedFilters>({});

  // Redirect to new collection URL structure
  useEffect(() => {
    const newPath = getCollectionPath(slug);
    if (newPath !== `/category/${slug}`) {
      router.replace(newPath);
    }
  }, [slug, router]);

  // Fetch filter options
  const { data: filterOptions, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: productsApi.fetchFilterOptions,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Fetch products
  const { products, meta, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useProducts({
      slug,
      per_page: 12,
      sort: sortBy,
      filters,
    });

  // Get category metadata
  const categoryInfo = categoryMetadata[slug] || {
    title: slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: 'Explore our premium collection of natural stone products.',
  };

  // Breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: categoryInfo.title },
  ];

  const handleFilterChange = (filterType: keyof SelectedFilters, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues.length > 0 ? newValues : undefined,
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />
      <CategoryHeader title={categoryInfo.title} description={categoryInfo.description} />

      <ProductActionsBar
        totalProducts={meta?.total_products || 0}
        sortBy={sortBy}
        filters={filters}
        filterOptions={filterOptions}
        isLoadingOptions={isLoadingOptions}
        onSortChange={setSortBy}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
        currentCategory={slug}
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
      </div>
    </div>
  );
}
