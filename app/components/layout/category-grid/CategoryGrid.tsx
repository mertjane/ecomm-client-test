// app/components/layout/category-grid/CategoryGrid.tsx
'use client';

import { CategoryGridSection } from '@/types/category-grid';
import { CategoryCard } from './CategoryCard';

interface CategoryGridProps {
  section: CategoryGridSection;
}

export function CategoryGrid({ section }: CategoryGridProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
      {/* Section Header */}
      {(section.heading || section.subheading) && (
        <div className="text-center mb-12 lg:mb-16">
          {section.subheading && (
            <p className="text-sm tracking-widest uppercase text-emperador mb-3 font-light">
              {section.subheading}
            </p>
          )}
          {section.heading && (
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-wider uppercase">
              {section.heading}
            </h2>
          )}
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 auto-rows-[300px] grid-flow-dense">
        {section.categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}