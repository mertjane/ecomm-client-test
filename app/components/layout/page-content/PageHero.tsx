'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  image?: string;
  className?: string;
}

export function PageHero({ title, image, className }: PageHeroProps) {
  return (
    <section className={cn('relative bg-emperador text-white', className)}>
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white mb-4">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
