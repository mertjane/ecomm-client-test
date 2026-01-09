"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

// Redux & Types
import { useAppSelector } from "@/lib/redux/hooks";
import { navigationItems, NavigationItem } from "@/types/navigation";
import { MegamenuItem } from "@/types/megamenu";

// --- Configuration for Stone Collection Columns ---
const stoneCollectionColumns = [
  {
    title: 'NATURAL STONE TILES',
    items: ['Marble Tiles', 'Limestone Tiles', 'Stone Mosaic Tiles', 'Slate Tiles', 'Travertine Tiles', 'Granite Tiles', 'Stone Pavers', 'Mouldings & Skirtings', 'Clay Brick Slips', 'Stone Shelves']
  },
  {
    title: 'STONE SLABS',
    items: ['Bookmatch Slabs', 'Slabs', 'Vanity Tops', 'Off Cut Granite & Quartz']
  },
  {
    title: 'STONE COLOURS',
    items: ['Whites', 'Blacks', 'Greys', 'Beiges & Browns', 'Creams & Yellows', 'Blues & Greens', 'Reds & Pinks', 'Multicolors & Patterns']
  },
  {
    title: 'USAGE AREAS',
    items: ['Bathroom', 'Kitchen', 'Living Room', 'Outdoor', 'Pool', 'Wet Room']
  },
  {
    title: 'STONE FINISHES',
    items: ['Brushed (Rough Finish)', 'Honed (Matt - Smooth)', 'Polished (Shiny Smooth)', 'Split Face', 'Tumbled (Rough Edgy)']
  }
];

interface MobileNavigationProps {
  onNavigate?: () => void;
}

export function MobileNavigation({ onNavigate }: MobileNavigationProps) {
  const pathname = usePathname();
  
  // Access the dynamic API data from Redux
  // Assuming your store slice is named 'megamenu' and has 'data'
  const { data: megamenuData } = useAppSelector((state) => state.megamenu);

  const isActive = (href: string) => pathname === href;

  // --- Helper: Find the API data corresponding to a static menu item ---
  const getMegamenuData = (apiLabel?: string): MegamenuItem | undefined => {
    if (!apiLabel || !megamenuData) return undefined;
    return megamenuData.find((item) => item.title === apiLabel);
  };

  // --- Render Logic: Stone Collection (Grouped) ---
  const renderStoneCollection = (data: MegamenuItem) => {
    // Flatten children to search through them
    const allChildren = data.children || [];

    return (
      <Accordion type="multiple" className="w-full pl-2">
        {stoneCollectionColumns.map((col, idx) => {
          // Find matching API items for this column
          const groupItems = col.items
            .map(targetTitle => allChildren.find(child => child.title === targetTitle))
            .filter((child): child is MegamenuItem => child !== undefined);

          if (groupItems.length === 0) return null;

          return (
            <AccordionItem key={col.title} value={`col-${idx}`} className="border-b-0 mb-2">
              <AccordionTrigger className="py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-emperador hover:no-underline">
                {col.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 pl-2 border-l border-muted ml-1">
                  {groupItems.map((child) => (
                    <MobileLink 
                      key={child.id} // using ID from API
                      href={child.url} 
                      onClick={onNavigate}
                      active={isActive(child.url)}
                    >
                      {child.title}
                    </MobileLink>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  };

  // --- Render Logic: Standard List (Featured or Projects) ---
  const renderStandardList = (data: MegamenuItem) => {
    const items = data.children || [];
    return (
      <div className="flex flex-col gap-1 pt-2 pb-4 pl-4">
        {items.map((child) => (
          <MobileLink
            key={child.id}
            href={child.url}
            onClick={onNavigate}
            active={isActive(child.url)}
          >
            {child.title}
          </MobileLink>
        ))}
      </div>
    );
  };

  return (
    <nav className="w-full">
      <Accordion type="single" collapsible className="w-full">
        {navigationItems.map((item: NavigationItem, index: number) => {
          // 1. Try to find dynamic data for this item
          const dynamicData = getMegamenuData(item.apiLabel);
          
          // 2. Check if we have children to show
          const hasChildren = dynamicData && dynamicData.children && dynamicData.children.length > 0;

          // 3. Fallback: If static item has its own submenu (NavigationSubItem[]) defined in code
          // Note: Your provided config didn't show static submenus, but we handle it just in case.
          const hasStaticSubmenu = item.submenu && item.submenu.length > 0;

          if (item.hasMegamenu && hasChildren && dynamicData) {
            return (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-muted">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-wide hover:no-underline py-5 text-foreground hover:text-emperador transition-colors">
                  {item.label}
                </AccordionTrigger>
                <AccordionContent>
                  {item.apiLabel === 'Stone Collection' 
                    ? renderStoneCollection(dynamicData) 
                    : renderStandardList(dynamicData)
                  }
                </AccordionContent>
              </AccordionItem>
            );
          }

          // Render Simple Link (No Megamenu)
          return (
            <AccordionItem key={index} value={`item-${index}`} className="border-b-muted">
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center justify-between py-5",
                  "text-sm font-bold uppercase tracking-wide",
                  "transition-colors hover:text-emperador",
                  isActive(item.href) && "text-emperador"
                )}
              >
                {item.label}
              </Link>
            </AccordionItem>
          );
        })}
      </Accordion>
    </nav>
  );
}

// Helper Component for consistent links
interface MobileLinkProps {
  children: React.ReactNode;
  href: string;
  active: boolean;
  onClick?: () => void;
}

function MobileLink({ children, href, active, onClick }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 py-2.5 px-2 rounded-md",
        "text-sm text-foreground/80 hover:text-emperador",
        "transition-colors hover:bg-muted/50",
        active && "bg-muted text-emperador font-medium"
      )}
    >
      {active && <ChevronRight className="h-3 w-3 text-emperador" />}
      {children}
    </Link>
  );
}