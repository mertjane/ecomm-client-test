
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Tag, TrendingDown } from 'lucide-react';
import { DealTimer } from './DealTimer';
import { DealBadge } from './DealBadge';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedProduct } from '@/lib/redux/slices/selectedProductSlice';
import type { SpecialDeal } from '@/types/special-deals';
import type { Product } from '@/types/product';


interface DealCardProps {
  deal: SpecialDeal;
  index: number;
}

// Decode HTML entities like &amp; to &
const decodeHtmlEntities = (text: string): string => {
  const textarea = typeof document !== 'undefined' ? document.createElement('textarea') : null;
  if (textarea) {
    textarea.innerHTML = text;
    return textarea.value;
  }
  // Fallback for SSR - handle common entities
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
};

export function DealCard({ deal, index }: DealCardProps) {
  const dispatch = useAppDispatch();

  const discountPercentage = Math.round(
    ((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100
  );

  const images = deal.images ?? [];
  const imageSrc = images[0]?.src || '/placeholder.png';

  const slug = deal.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  // Transform SpecialDeal to Product format for SingleProductPage
  const productForStore: Product = {
    id: Number(deal.id),
    name: deal.title,
    slug: slug,
    permalink: deal.link,
    price: String(deal.discountPrice),
    regular_price: String(deal.originalPrice),
    sale_price: String(deal.discountPrice),
    price_html: `${deal.discountPrice.toFixed(2)}`,
    stock_status: deal.stock && deal.stock > 0 ? 'instock' : 'outofstock',
    categories: deal.category ? [{ id: 0, name: deal.category, slug: deal.category.toLowerCase() }] : [],
    images: images.map(img => ({ ...img, name: img.alt || deal.title })),
    attributes: [],
    variations: [],
    yoast_head_json: { og_image: images.map(img => ({ url: img.src, width: 0, height: 0, type: '' })) }
  };

  const handleClick = () => {
    dispatch(setSelectedProduct(productForStore));
  };

  return (
    <Link
      href={`/product/${slug}`}
      onClick={handleClick}
      className={cn(
        'group relative bg-card rounded-lg overflow-hidden',
        'border border-border transition-all duration-500',
        'hover:shadow-2xl hover:shadow-emperador/20 hover:-translate-y-1',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Deal Badge */}
      <DealBadge
        type={deal.badgeType}
        text={deal.badgeText}
        discount={discountPercentage}
      />

      {/* Product Image */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <Image
          src={imageSrc}
          alt={deal.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-granite/80 via-granite/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick View Badge on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="bg-porcelain text-granite px-6 py-3 rounded-md text-sm font-medium tracking-wider uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            View Deal
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        {deal.category && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest">{decodeHtmlEntities(deal.category)}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-medium tracking-wide uppercase mb-3 text-card-foreground line-clamp-2 group-hover:text-emperador transition-colors duration-300">
          {decodeHtmlEntities(deal.title)}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl font-semibold text-emperador">
            £{deal.discountPrice.toFixed(2)}
          </span>
          <span className="text-base text-muted-foreground line-through">
            £{deal.originalPrice.toFixed(2)}
          </span>
          {/* <div className="flex items-center gap-1 text-xs font-medium text-destructive ml-auto">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>{discountPercentage}%</span>
          </div> */}
        </div>

        {/* Timer */}
        {/* {deal.expiresAt && (
          <DealTimer expiresAt={deal.expiresAt} />
        )} */}

        {/* Stock Indicator */}
       {/*  {deal.stock !== undefined && deal.stock < 20 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground uppercase tracking-wider">
                Only {deal.stock} left
              </span>
              <div className="flex-1 mx-3 bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-destructive to-emperador transition-all duration-500"
                  style={{ width: `${Math.min((deal.stock / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Decorative Border on Hover */}
      <div className="absolute inset-0 border-2 border-emperador/0 group-hover:border-emperador/30 rounded-lg transition-colors duration-500 pointer-events-none" />
    </Link>
  );
}
