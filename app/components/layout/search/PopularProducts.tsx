{/*'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setPopularProducts } from '@/lib/redux/slices/searchSlice';
import { ProductCard } from '../product-grid/ProductCard';
import { productsApi } from '@/lib/api/products';

export function PopularProducts() {
  const dispatch = useAppDispatch();
  const popularProducts = useAppSelector((state) => state.search.popularProducts);

  useEffect(() => {
    const loadPopularProducts = async () => {
      if (popularProducts.length === 0) {
        try {
          // Fetch popular products sorted by popularity
          const response = await productsApi.fetchProducts({
            page: 1,
            per_page: 8,
            sort: 'popularity',
          });

          dispatch(setPopularProducts(response.data));
        } catch (error) {
          console.error('Failed to load popular products:', error);
        }
      }
    };

    loadPopularProducts();
  }, [dispatch, popularProducts.length]);

  if (popularProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold uppercase tracking-wide mb-4">
        Popular Products
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {popularProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

*/}