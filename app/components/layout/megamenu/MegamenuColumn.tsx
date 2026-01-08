'use client';

import Link from 'next/link';
import { MegamenuItem } from '@/types/megamenu';

interface MegamenuColumnProps {
  item: MegamenuItem;
}
 
export function MegamenuColumn({ item }: MegamenuColumnProps) {
  return (
    <div className="space-y-3">
      {/* Column Header */}
      <h3 className="text-emperador font-semibold tracking-wider uppercase text-xs pb-2 border-b-2 border-emperador/30">
        {item.url ? (
          <Link
            href={item.url}
            className="hover:text-granite transition-colors"
          >
            {item.title}
          </Link>
        ) : (
          <span>{item.title}</span>
        )}
      </h3>

      {/* Column Items */}
      {item.children && item.children.length > 0 && (
        <ul className="space-y-1">
          {item.children.map((child: MegamenuItem, index: number) => (
            <li key={`${child.title || child.title}-${index}`} className='cursor-pointer hover:text-emperador transition-all duration-200 hover:translate-x-1'>
              {child.url ? (
                <Link
                  href={child.url}
                  className="text-sm text-foreground/70  block py-1.5"
                >
                  {child.title}
                </Link>
              ) : (
                <span className="text-sm text-foreground/60 block py-1.5">
                  {child.title}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}