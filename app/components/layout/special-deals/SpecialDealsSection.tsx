'use client';

import { useSpecialDeals } from '@/lib/hooks/useSpecialDeals';
import { SpecialDeals } from './SpecialDeals';

interface SpecialDealsSectionProps {
  title?: string;
  subtitle?: string;
}

export function SpecialDealsSection({
  title = 'Special Deals',
  subtitle = 'Limited Time Offers'
}: SpecialDealsSectionProps) {
  const { data: deals, isLoading, error } = useSpecialDeals(1, 8);

  if (isLoading) {
    return (
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            {subtitle && (
              <p className="text-sm tracking-widest uppercase text-muted-foreground mb-3 subheading">
                {subtitle}
              </p>
            )}
            <h2 className="text-foreground mb-4">{title}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emperador to-transparent mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive">Failed to load special deals. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">No special deals available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return <SpecialDeals deals={deals} title={title} subtitle={subtitle} />;
}