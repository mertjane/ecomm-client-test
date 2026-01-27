'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from "motion/react";
import { Eye, Package, Loader2 } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { openQuickView } from '@/lib/redux/slices/quickViewSlice';
import { setSelectedProduct } from '@/lib/redux/slices/selectedProductSlice';
import { useCart } from '@/lib/hooks/useCart';
import { fetchProductVariations } from '@/lib/api/variations';
import { PLACEHOLDER_IMAGE } from '@/lib/constants/images';
import type { Product } from '@/types/product';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { addSampleToCart } = useCart();

  const [isHovered, setIsHovered] = useState(false);
  const [isOrderHovered, setIsOrderHovered] = useState(false);
  const [isAddingSample, setIsAddingSample] = useState(false);

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

  const handleOrderSample = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check stock status
    if (product.stock_status !== 'instock') {
      alert('Sorry, this product is currently out of stock.');
      return;
    }

    // Prevent double-clicks
    if (isAddingSample) return;

    setIsAddingSample(true);

    try {
      // Fetch all variations for this product
      const variations = await fetchProductVariations(product.id);

      // Find the FREE sample variation by SKU containing "free-sample"
      // This distinguishes from "Full Size Sample" which is paid
      const freeSampleVariation = variations.find((variation) =>
        variation.sku?.toLowerCase().includes('free-sample') ||
        variation.name?.toLowerCase().includes('free sample')
      );

      if (!freeSampleVariation) {
        alert('No free sample available for this product.');
        return;
      }

      // Check if free sample variation is in stock
      if (freeSampleVariation.stock_status === 'outofstock') {
        alert('Sorry, the free sample is currently out of stock.');
        return;
      }

      // Add the free sample variation to cart
      const result = await addSampleToCart(product.id, freeSampleVariation.id);

      if (!result.success) {
        alert(result.message || 'Failed to add sample to cart');
      }
      // Cart drawer opens automatically on success
    } catch (error) {
      alert('Failed to add sample to cart. Please try again.');
    } finally {
      setIsAddingSample(false);
    }
  };

  const handleProductClick = () => {
    dispatch(setSelectedProduct(product));
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

  return (
    <div className="group bg-card border border-border hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/product/${product.slug}`}
          onClick={handleProductClick}
          className="block h-full w-full" >
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
          <>
            {/* Background overlay - doesn't block clicks */}
            <div className="hidden md:block absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

            {/* Buttons container - centered, only buttons are clickable, hidden until hover */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center gap-3 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">

            {/* WRAPPER: Handles the "Slide Up" CSS animation separately */}
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 pointer-events-auto">
              <motion.button
                layout
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleQuickView(e);
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                // REMOVED: transform, translate, transition classes from here
                className="bg-white text-foreground h-10 px-3 rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-emperador hover:text-white overflow-hidden"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {isHovered ? (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      Quick View
                    </motion.span>
                  ) : (
                    <motion.span
                      key="icon"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Eye className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

           {/* --- ORDER SAMPLE BUTTON --- */}
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 pointer-events-auto">
              <motion.button
                layout
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOrderSample(e);
                }}
                onHoverStart={() => setIsOrderHovered(true)}
                onHoverEnd={() => setIsOrderHovered(false)}
                disabled={isAddingSample}
                className="bg-white text-foreground h-10 px-3 rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-emperador hover:text-white overflow-hidden disabled:opacity-70"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {isAddingSample ? (
                    <motion.span
                      key="os-loading"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.span>
                  ) : isOrderHovered ? (
                    <motion.span
                      key="os-text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      Order Sample
                    </motion.span>
                  ) : (
                    <motion.span
                      key="os-icon"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <Package className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            </div>
          </>
        )}

        {/* ============================================== */}
        {/* 2. MOBILE ACTION BAR (Hidden on Desktop)       */}
        {/* ============================================== */}
        {product.stock_status !== 'outofstock' && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-20">
            <div className="flex">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleQuickView(e);
                }}
                className="flex-1 bg-white/50 backdrop-blur-sm text-emperador py-2.5 flex items-center justify-center gap-2 border-t border-r border-border active:bg-muted transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Quick View</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOrderSample(e);
                }}
                disabled={isAddingSample}
                className="flex-1 bg-white/50 backdrop-blur-sm text-emperador py-2.5 flex items-center justify-center gap-2 border-t border-border active:bg-muted transition-colors disabled:opacity-70"
              >
                {isAddingSample ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
                <span className="text-xs font-medium uppercase tracking-wide">
                  {isAddingSample ? 'Adding...' : 'Order Sample'}
                </span>
              </button>
            </div>
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
      <Link href={`/product/${product.slug}`}
        onClick={handleProductClick}
        className="block p-4 no-underline">
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