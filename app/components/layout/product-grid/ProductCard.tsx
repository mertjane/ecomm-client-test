'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, Package } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { openQuickView } from '@/lib/redux/slices/quickViewSlice';
import { PLACEHOLDER_IMAGE } from '@/lib/constants/images';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const imageSrc =
    product.images?.[0]?.src ||
    product.yoast_head_json?.og_image?.[0]?.url ||
    PLACEHOLDER_IMAGE;

  const imageAlt = product.images?.[0]?.alt || product.name;

  // Always use price_html for displaying prices (WooCommerce formatted HTML)
  const priceHtml = product.price_html || '';

  // Parse numeric values for sale detection
  const regularPrice = product.regular_price ? parseFloat(product.regular_price) : 0;
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : 0;

  const isOnSale = salePrice > 0 && salePrice < regularPrice;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openQuickView(product));
  };

  const handleOrderSample = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Open order sample modal/form
    console.log('Order sample:', product.slug);
  };

  const isTile = Array.isArray(product.attributes)
    ? product.attributes.some(attr =>
      attr.slug === 'pa_material' &&
      Array.isArray(attr.options) &&
      attr.options.some(opt =>
        ['marble', 'travertine', 'limestone', 'mosaic', 'granite']
          .some(v => opt?.toLowerCase()?.includes(v))
      )
    )
    : false;




  console.log('Is this a tile?', isTile);


  return (
    <div className="group bg-card border border-border hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            unoptimized={imageSrc === PLACEHOLDER_IMAGE}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
        </Link>

        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 text-xs uppercase tracking-wider font-medium z-10">
            Sale
          </div>
        )}

        {/* ============================================== */}
        {/* 1. DESKTOP HOVER OVERLAY (Hidden on Mobile)    */}
        {/* ============================================== */}
        {product.stock_status !== 'outofstock' && (
          <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-3 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Critical to prevent opening product page
                handleQuickView(e);
              }}
              className="bg-white hover:bg-emperador text-foreground hover:text-white p-3 rounded-full transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg"
              aria-label="Quick view"
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOrderSample(e);
              }}
              className="bg-white hover:bg-emperador text-foreground hover:text-white p-3 rounded-full transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75 shadow-lg"
              aria-label="Order sample"
              title="Order sample"
            >
              <Package className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ============================================== */}
        {/* 2. MOBILE FLOATING BUTTONS (Hidden on Desktop) */}
        {/* ============================================== */}
        {product.stock_status !== 'outofstock' && (
          <div className="md:hidden absolute bottom-3 right-3 flex gap-2 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleQuickView(e);
              }}
              className="bg-white/90 text-foreground border border-black/10 p-2 rounded-full shadow-md active:scale-95 transition-transform"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOrderSample(e);
              }}
              className="bg-white/90 text-foreground border border-black/10 p-2 rounded-full shadow-md active:scale-95 transition-transform"
              aria-label="Order sample"
            >
              <Package className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stock Status */}
        {product.stock_status === 'outofstock' && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <span className="text-foreground uppercase tracking-wider font-medium text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <Link href={`/products/${product.slug}`} className="block p-4 no-underline">
        {/* Category */}
        {product.categories?.[0] && (
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 subheading">
            {product.categories[0].name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-foreground text-base font-medium uppercase tracking-wide mb-3 line-clamp-2 group-hover:text-emperador transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center">
          <span className="text-emperador  mr-2">FROM</span>

          {priceHtml ? (
            <div className="flex items-baseline gap-1">
              {/* Price Number */}

              £
              <div
                className="text-foreground font-medium"
                dangerouslySetInnerHTML={{ __html: priceHtml }}
              />

              {/* Unit Suffix */}
              {isTile && (
                <span className="text-sm text-muted-foreground font-normal">
                  / M²
                </span>
              )}
            </div>
          ) : (
            <span className="text-foreground font-medium">N/A</span>
          )}
        </div>
      </Link>
    </div>


  );
}