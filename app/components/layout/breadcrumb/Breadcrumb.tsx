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
    <nav aria-label="Breadcrumb" className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center justify-center space-x-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight
                    className="w-3 h-3 mx-2 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                )}

                {isLast || !item.href ? (
                  <span className="text-foreground font-medium uppercase tracking-wide">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide no-underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}