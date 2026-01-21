'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  image?: string;
  className?: string;
}

export function PageHero({ title, className }: PageHeroProps) {
  return (
    <section className={cn('relative bg-emperador text-white', className)}>
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
