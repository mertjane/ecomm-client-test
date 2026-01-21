'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="w-full bg-background border-b border-border relative z-40">
      <div className="container mx-auto px-4 py-3">
        {/* Relative wrapper for the fade positioning */}
        <div className="relative">

          {/* Scroll Container */}
          <div
            className="
              overflow-x-auto 
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              /* Added -mx-4 px-4 to allow scroll to touch screen edges on mobile while keeping container padding */
              -mx-4 px-4 sm:mx-0 sm:px-0
            "
          >
            <ol
              className="
                flex items-center 
                /* MAGIC COMBO FOR CENTERED SCROLL: */
                w-max mx-auto 
                /* ------------------------------- */
                space-x-2 text-sm
                /* Add padding right so last item isn't covered by fade */
                pr-12 pl-4 sm:pl-0
              "
            >
              {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                  <li key={index} className="flex items-center shrink-0">
                    {index > 0 && (
                      <ChevronRight
                        className="w-3 h-3 mx-2 text-muted-foreground shrink-0"
                        strokeWidth={1.5}
                      />
                    )}

                    {isLast || !item.href ? (
                      <span className="text-foreground font-medium uppercase tracking-wide whitespace-nowrap">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide no-underline whitespace-nowrap"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Fade Overlay (Right side) */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"
            aria-hidden="true"
          />

          {/* Optional: Fade Overlay (Left side) - Useful for centered content so it looks good when scrolling back */}
          {/* <div 
            className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" 
            aria-hidden="true"
          /> */}

        </div>
      </div>
    </nav>
  );
}