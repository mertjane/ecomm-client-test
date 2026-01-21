'use client';

import { MegamenuItem } from '@/types/megamenu';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';

interface MegamenuPanelProps {
  item: MegamenuItem;
  onClose: () => void;
}

const urlOverrides: Record<string, string> = {
  'Beiges & Browns': '/colour/beiges-browns',
  'Creams & Yellows': '/colour/creams-yellows',
  'Blues & Greens': '/colour/blues-greens',
  'Reds & Pinks': '/colour/reds-pinks',
  'Multicolors & Patterns': '/colour/multicolor',
  // Ensure the singulars are correct too
  'Whites': '/colour/whites',
  'Blacks': '/colour/blacks',
  'Greys': '/colour/greys'
};

// Column structure for Stone Collection
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

// Featured images mapping for special menus
const featuredMap: Record<string, { title: string; description: string; image: string }[]> = {
  'Custom Stone Works': [
    {
      title: 'Natural Stone Features',
      description: 'Transform your property with premium natural stone walls, patios, and walkways',
      image: '/images/megamenu1.webp',
    },
    {
      title: 'Custom Kitchen Surfaces',
      description: 'Premium granite, marble & quartz countertops fabricated to perfection',
      image: '/images/megamenu2.webp',
    },
    {
      title: 'Outdoor Living Spaces',
      description: 'Create stunning outdoor environments with custom stone fire pits and features',
      image: '/images/megamenu3.webp',
    },
  ],
  'Design & Pattern': [
    {
      title: 'Natural Stone Features',
      description: 'Elevate your interiors with the timeless elegance of chequerboard marble tiles — a bold yet classic design that never goes out of style.',
      image: '/images/megamenu4.webp',
    },
    {
      title: 'Custom Kitchen Surfaces',
      description: 'Transform your kitchen with stunning herringbone patterns that add sophistication and visual interest to any space',
      image: '/images/megamenu5.webp',
    },
  ],
  'Stone Project': [
    {
      title: 'Commercial Excellence',
      description: 'Discover our portfolio of stunning commercial stone installations, from luxury hotels to corporate headquarters',
      image: '/images/commercial-projects.jpg',
    },
    {
      title: 'Residential Masterpieces',
      description: 'Explore beautiful residential projects featuring custom stonework that transforms houses into dream homes',
      image: '/images/residential-projects.jpg',
    },
  ],
};

export function MegamenuPanel({ item, onClose }: MegamenuPanelProps) {
  if (!item.children || item.children.length === 0) return null;

  // Special handling for Stone Collection with organized columns
  if (item.title === 'Stone Collection') {
    return (
      <div className="w-full bg-background relative">
        <CloseButton onClick={onClose} />
        <div className="mx-auto px-24 py-10">
          <div className="grid grid-cols-5 gap-x-12">
            {stoneCollectionColumns.map((column, colIndex) => {
              // Find matching items from API data by title
              const columnItems = column.items
                .map(itemTitle => {
                  const foundChild = item.children.find(child => child.title === itemTitle);
                  
                  // If we found the child, check if we need to force a specific URL
                  if (foundChild) {
                    if (urlOverrides[itemTitle]) {
                      return { ...foundChild, url: urlOverrides[itemTitle] };
                    }
                    return foundChild;
                  }
                  return undefined;
                })
                .filter((child): child is MegamenuItem => child !== undefined);

              return (
                <div key={colIndex} className="space-y-3">
                  {/* Column Header */}
                  <h3 className="text-emperador font-semibold tracking-wider uppercase text-xs pb-2 border-b-2 border-emperador/30">
                    {column.title}
                  </h3>
                  {/* Column Items */}
                  <div className="space-y-1">
                    {columnItems.map((child, index) => (
                      <MenuLink key={`${child.title}-${index}`} child={child} onClose={onClose} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Check if this menu should display as full megamenu (not in featuredMap)
  const shouldShowFullMegamenu = !featuredMap[item.title];

  // Full megamenu with columns (other menus without special structure)
  if (shouldShowFullMegamenu) {
    // Split children into columns (5 columns for better layout)
    const itemsPerColumn = Math.ceil(item.children.length / 5);
    const columns: MegamenuItem[][] = [];

    for (let i = 0; i < 5; i++) {
      const start = i * itemsPerColumn;
      const end = start + itemsPerColumn;
      const columnItems = item.children.slice(start, end);
      if (columnItems.length > 0) {
        columns.push(columnItems);
      }
    }

    return (
      <div className="w-full bg-background relative">
        <CloseButton onClick={onClose} />
        <div className="mx-auto px-24 py-10">
          <div className="grid grid-cols-5 gap-x-12">
            {columns.map((columnItems, colIndex) => (
              <div key={colIndex} className="space-y-1">
                {columnItems.map((child, index) => (
                  <MenuLink key={`${child.title}-${index}`} child={child} onClose={onClose} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Special menus with featured images
  const features = featuredMap[item.title];
  if (features) {
    return (
      <div className="w-full bg-background relative">
        <CloseButton onClick={onClose} />
        <div className="mx-auto px-24 py-10">
          <div className="grid grid-cols-[280px_1fr] gap-12">
            {/* Left: Menu Items */}
            <div className="space-y-1">
              <h3 className="text-emperador font-semibold tracking-wider uppercase text-sm mb-4 pb-2 border-b-2 border-emperador/30">
                {item.title}
              </h3>
              {item.children.map((child, index) => (
                <MenuLink key={`${child.title || child.title}-${index}`} child={child} onClose={onClose} />
              ))}
            </div>

            {/* Right: Featured Images */}
            <div className={`grid ${features.length === 2 ? 'grid-cols-2 gap-8' : 'grid-cols-3 gap-6'}`}>
              {features.map((feature, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative aspect-[16/10] sm:aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <h4 className="text-emperador font-medium text-base mb-2">{feature.title}</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Close button component
const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors z-10"
    aria-label="Close menu"
  >
    <X className="w-5 h-5 text-emperador" />
  </button>
);

// Menu link component
const MenuLink = ({ child, onClose }: { child: MegamenuItem; onClose: () => void }) => {
  if (!child) return null;
  return child.url ? (
    <Link
      href={child.url}
      className="text-sm text-foreground/70 hover:text-emperador transition-all duration-200 block py-2 hover:translate-x-1"
      onClick={onClose}
    >
      {child.title}
    </Link>
  ) : (
    <span className="text-sm cursor-pointer hover:text-emperador transition-all duration-200 hover:translate-x-1 text-foreground/60 block py-2">
      {child.title}
    </span>
  );
};
