'use client';

import { DealCard } from './DealCard';
import type { SpecialDeal } from '@/types/special-deals';

interface SpecialDealsProps {
  deals: SpecialDeal[];
  title?: string;
  subtitle?: string;
}

export function SpecialDeals({
  deals,
  title = 'Special Deals',
  subtitle = 'Limited Time Offers'
}: SpecialDealsProps) {
  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          {subtitle && (
            <p className="text-sm tracking-widest uppercase text-muted-foreground mb-3 subheading">
              {subtitle}
            </p>
          )}
          <h2 className="text-foreground mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emperador to-transparent mx-auto" />
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {deals.map((deal, index) => (
            <DealCard
              key={deal.id}
              deal={deal}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
