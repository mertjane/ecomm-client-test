'use client';

import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';
import { CategoryHeader } from '@/app/components/layout/category-header';
import { ProductGrid, LoadMoreButton } from '@/app/components/layout/product-grid';
import { useNewArrivals } from '@/lib/hooks/useNewArrivals';

export default function NewArrivalsPage() {
  const { products, meta, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNewArrivals(12);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: 'New Arrivals' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />
      <CategoryHeader
        title="New Arrivals"
        description="Discover our newest stone tile collections and exclusive designs from the last 2 months"
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
              No new arrivals at the moment. Check back soon!
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
