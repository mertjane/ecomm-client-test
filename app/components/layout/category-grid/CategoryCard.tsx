// app/components/layout/category-grid/CategoryCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CategoryCard as CategoryCardType } from '@/types/category-grid';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: CategoryCardType;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const isLarge = category.featured;

  return (
    <Link
      href={category.link}
      className={cn(
        'group relative overflow-hidden rounded-md',
        'transition-all duration-500 hover:shadow-xl',
        // This is the magic:
        isLarge ? 'md:row-span-2 h-full' : 'md:row-span-1 h-full',
        // Optional: Make the first large card span 2 cols on tablet for better flow
        index === 0 && isLarge && 'md:col-span-2 lg:col-span-1'
      )}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            category.theme === 'light'
              ? 'bg-gradient-to-t from-background/90 via-background/40 to-transparent'
              : 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
          )}
        />
      </div>

      {/* Content */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end p-8',
          category.theme === 'light' ? 'text-foreground' : 'text-white'
        )}
      >
        {category.subtitle && (
          <p className="text-xs tracking-widest uppercase mb-2 opacity-90 font-light">
            {category.subtitle}
          </p>
        )}

        <h3
          className={cn(
            'font-semibold tracking-wider uppercase mb-3 transition-transform duration-300 group-hover:translate-x-1',
            isLarge ? 'text-3xl lg:text-4xl' : 'text-xl lg:text-2xl'
          )}
        >
          {category.title}
        </h3>

        {category.description && isLarge && (
          <p className="text-sm leading-relaxed mb-4 opacity-90 max-w-md">
            {category.description}
          </p>
        )}

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm tracking-wider uppercase font-medium">
          <span className="border-b-2 border-current pb-1 transition-all duration-300 group-hover:pr-2">
            Shop Now
          </span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-emperador/0 group-hover:border-emperador/50 transition-colors duration-500 rounded-lg pointer-events-none" />
    </Link>
  );
}