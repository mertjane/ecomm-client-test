// app/components/layout/Navigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { navigationItems } from '@/types/navigation';
import { useMegamenu } from '@/lib/hooks/useMegamenu';
import { MegamenuPanel } from '../megamenu/MegamenuPanel';
import { MegamenuItem } from '@/types/megamenu';
import { ChevronDown } from 'lucide-react';

interface NavigationProps {
  position: 'left' | 'right';
}

export function Navigation({ position }: NavigationProps) {
  const pathname = usePathname();
  const { data: megamenuData, isLoading } = useMegamenu();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const items =
    position === 'left'
      ? navigationItems.slice(0, 2)
      : navigationItems.slice(2);

  const getMegamenuItem = (apiLabel: string): MegamenuItem | undefined => {
    if (!megamenuData) return undefined;
    return megamenuData.find(
      (item: MegamenuItem) =>
        item.title.toLowerCase() === apiLabel.toLowerCase()
    );
  };

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleMegamenuEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMegamenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleClose = () => {
    setActiveMenu(null);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <nav className="flex items-center gap-1">
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </nav>
    );
  }

  const activeNavItem = items.find(item => item.label === activeMenu);
  const activeMegamenuItem = activeNavItem?.apiLabel 
    ? getMegamenuItem(activeNavItem.apiLabel)
    : undefined;

  return (
    <>
      <nav className="relative flex items-center gap-1">
        {items.map((item, index) => {
          const megamenuItem = item.hasMegamenu && item.apiLabel
            ? getMegamenuItem(item.apiLabel)
            : null;
          const isActive = activeMenu === item.label;
          const isCurrentPage = pathname.startsWith(item.href);

          return (
            <div
              key={`${item.href}-${index}`}
              className="relative"
              onMouseEnter={() =>
                megamenuItem && handleMouseEnter(item.label)
              }
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  'inline-flex items-center justify-center gap-1',
                  'h-auto px-4 py-2 rounded-md',
                  'text-sm font-normal tracking-wider uppercase whitespace-nowrap',
                  'transition-all duration-300 relative',
                  'hover:text-emperador',
                  isCurrentPage && 'text-emperador font-medium'
                )}
              >
                {item.label}
                {megamenuItem && (
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isActive && 'rotate-180'
                    )}
                  />
                )}
                
                <span
                  className={cn(
                    'absolute bottom-1 left-4 right-4 h-0.5 bg-emperador',
                    'transform origin-left transition-transform duration-300',
                    isActive || isCurrentPage
                      ? 'scale-x-100'
                      : 'scale-x-0 hover:scale-x-100'
                  )}
                />
              </button>
            </div>
          );
        })}
      </nav>

      {activeMegamenuItem && (
        <div
          className="fixed left-0 right-0 z-50 bg-background border-t border-b border-border shadow-xl"
          style={{ 
            top: 'calc(var(--header-top-height, 52px) + var(--header-nav-height, 84px))'
          }}
          onMouseEnter={handleMegamenuEnter}
          onMouseLeave={handleMegamenuLeave}
        >
          <MegamenuPanel
            item={activeMegamenuItem}
            onClose={handleClose}
          />
        </div>
      )}
    </>
  );
}