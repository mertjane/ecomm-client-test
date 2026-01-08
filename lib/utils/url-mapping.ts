/**
 * URL Mapping Utility for SEO-friendly Collection URLs
 * Maps WooCommerce categories and attributes to proper URL structures
 */

export type CollectionType = 'product_cat' | 'pa_color' | 'pa_room_type_usage' | 'pa_finish';

export interface URLMapping {
  slug: string;
  path: string;
  type: CollectionType;
  title: string;
  parentPath?: string;
}

/**
 * Complete URL mapping for all collection pages
 */
export const URL_MAPPINGS: Record<string, URLMapping> = {
  // Stone Collection - Natural Stone Tiles
  'marble-tiles': {
    slug: 'marble-tiles',
    path: '/collections/stone-collection/marble-tiles',
    type: 'product_cat',
    title: 'Marble Tiles',
    parentPath: '/collections/stone-collection',
  },
  'limestone-tiles': {
    slug: 'limestone-tiles',
    path: '/collections/stone-collection/limestone-tiles',
    type: 'product_cat',
    title: 'Limestone Tiles',
    parentPath: '/collections/stone-collection',
  },
  'travertine-tiles': {
    slug: 'travertine-tiles',
    path: '/collections/travertine-tiles',
    type: 'product_cat',
    title: 'Travertine Tiles',
  },
  'mosaic-tiles': {
    slug: 'mosaic-tiles',
    path: '/collections/mosaic-tiles',
    type: 'product_cat',
    title: 'Mosaic Tiles',
  },
  'slate-tiles': {
    slug: 'slate-tiles',
    path: '/collections/slate-tiles',
    type: 'product_cat',
    title: 'Slate Tiles',
  },
  'granite-tiles': {
    slug: 'granite-tiles',
    path: '/collections/granite-tiles',
    type: 'product_cat',
    title: 'Granite Tiles',
  },
  'stone-pavers': {
    slug: 'stone-pavers',
    path: '/collections/stone-pavers',
    type: 'product_cat',
    title: 'Stone Pavers',
  },
  'clay-brick-slips': {
    slug: 'clay-brick-slips',
    path: '/collections/clay-brick-slips',
    type: 'product_cat',
    title: 'Clay Brick Slips',
  },

  // Stone Collection - Stone Slabs
  'bookmatch-slabs': {
    slug: 'bookmatch-slabs',
    path: '/collections/bookmatch-slabs',
    type: 'product_cat',
    title: 'Bookmatch Slabs',
  },
  'slabs': {
    slug: 'slabs',
    path: '/collections/slabs',
    type: 'product_cat',
    title: 'Slabs',
  },
  'vanity-tops': {
    slug: 'vanity-tops',
    path: '/collections/vanity-tops',
    type: 'product_cat',
    title: 'Vanity Tops',
  },
  'off-cut-granite-quartz': {
    slug: 'off-cut-granite-quartz',
    path: '/collections/off-cut-granite-quartz',
    type: 'product_cat',
    title: 'Off Cut Granite & Quartz',
  },

  // Stone Collection - Stone Colours (pa_color)
  'whites': {
    slug: 'whites',
    path: '/colour/whites',
    type: 'pa_color',
    title: 'Whites',
  },
  'blacks': {
    slug: 'blacks',
    path: '/colour/blacks',
    type: 'pa_color',
    title: 'Blacks',
  },
  'greys': {
    slug: 'greys',
    path: '/colour/greys',
    type: 'pa_color',
    title: 'Greys',
  },
  'beiges-browns': {
    slug: 'beiges-browns',
    path: '/colour/beiges-browns',
    type: 'pa_color',
    title: 'Beiges & Browns',
  },
  'creams-yellows': {
    slug: 'creams-yellows',
    path: '/colour/creams-yellows',
    type: 'pa_color',
    title: 'Creams & Yellows',
  },
  'blues-greens': {
    slug: 'blues-greens',
    path: '/colour/blues-greens',
    type: 'pa_color',
    title: 'Blues & Greens',
  },
  'reds-pinks': {
    slug: 'reds-pinks',
    path: '/colour/reds-pinks',
    type: 'pa_color',
    title: 'Reds & Pinks',
  },
  'multicolors-patterns': {
    slug: 'multicolors-patterns',
    path: '/colour/multicolors-patterns',
    type: 'pa_color',
    title: 'Multicolors & Patterns',
  },

  // Stone Collection - Usage Areas (pa_room_type_usage)
  'bathroom': {
    slug: 'bathroom',
    path: '/room-type-usage/bathroom',
    type: 'pa_room_type_usage',
    title: 'Bathroom',
  },
  'bathroom-floor': {
    slug: 'bathroom-floor',
    path: '/room-type-usage/bathroom-floor',
    type: 'pa_room_type_usage',
    title: 'Bathroom Floor',
  },
  'kitchen': {
    slug: 'kitchen',
    path: '/room-type-usage/kitchen',
    type: 'pa_room_type_usage',
    title: 'Kitchen',
  },
  'kitchen-splashback': {
    slug: 'kitchen-splashback',
    path: '/room-type-usage/kitchen-splashback',
    type: 'pa_room_type_usage',
    title: 'Kitchen Splashback',
  },
  'living-room': {
    slug: 'living-room',
    path: '/room-type-usage/living-room',
    type: 'pa_room_type_usage',
    title: 'Living Room',
  },
  'living-room-floor': {
    slug: 'living-room-floor',
    path: '/room-type-usage/living-room-floor',
    type: 'pa_room_type_usage',
    title: 'Living Room Floor',
  },
  'outdoor': {
    slug: 'outdoor',
    path: '/room-type-usage/outdoor',
    type: 'pa_room_type_usage',
    title: 'Outdoor',
  },
  'pool': {
    slug: 'pool',
    path: '/room-type-usage/pool',
    type: 'pa_room_type_usage',
    title: 'Pool',
  },
  'wet-room': {
    slug: 'wet-room',
    path: '/room-type-usage/wet-room',
    type: 'pa_room_type_usage',
    title: 'Wet Room',
  },

  // Stone Collection - Stone Finishes (pa_finish)
  'brushed-rough-finish': {
    slug: 'brushed-rough-finish',
    path: '/finish/brushed-rough-finish',
    type: 'pa_finish',
    title: 'Brushed Rough Finish',
  },
  'honed-matt-smooth': {
    slug: 'honed-matt-smooth',
    path: '/finish/honed-matt-smooth',
    type: 'pa_finish',
    title: 'Honed Matt Smooth',
  },
  'polished-shiny-smooth': {
    slug: 'polished-shiny-smooth',
    path: '/finish/polished-shiny-smooth',
    type: 'pa_finish',
    title: 'Polished Shiny Smooth',
  },
  'split-face': {
    slug: 'split-face',
    path: '/finish/split-face',
    type: 'pa_finish',
    title: 'Split Face',
  },
  'tumbled-rough-edgy': {
    slug: 'tumbled-rough-edgy',
    path: '/finish/tumbled-rough-edgy',
    type: 'pa_finish',
    title: 'Tumbled Rough Edgy',
  },

  // Custom Stonework
  'stone-windowsills': {
    slug: 'stone-windowsills',
    path: '/collections/stone-windowsills',
    type: 'product_cat',
    title: 'Stone Windowsills',
  },
  'mouldings-skirtings': {
    slug: 'mouldings-skirtings',
    path: '/collections/mouldings-skirtings',
    type: 'product_cat',
    title: 'Mouldings & Skirtings',
  },
  'stone-sinks': {
    slug: 'stone-sinks',
    path: '/collections/stone-sinks',
    type: 'product_cat',
    title: 'Stone Sinks',
  },
  'slate-hearths': {
    slug: 'slate-hearths',
    path: '/collections/slate-hearths',
    type: 'product_cat',
    title: 'Slate Hearths',
  },
  'table-tops': {
    slug: 'table-tops',
    path: '/collections/table-tops',
    type: 'product_cat',
    title: 'Table Tops',
  },

  // Design & Pattern
  'chequerboard-tiles': {
    slug: 'chequerboard-tiles',
    path: '/collections/design-pattern-collection/chequerboard-tiles',
    type: 'product_cat',
    title: 'Chequerboard Tiles',
    parentPath: '/collections/design-pattern-collection',
  },
  'herringbone-tiles': {
    slug: 'herringbone-tiles',
    path: '/collections/design-pattern-collection/herringbone-tiles',
    type: 'product_cat',
    title: 'Herringbone Tiles',
    parentPath: '/collections/design-pattern-collection',
  },
  'hexagon-tiles': {
    slug: 'hexagon-tiles',
    path: '/collections/design-pattern-collection/hexagon-tiles',
    type: 'product_cat',
    title: 'Hexagon Tiles',
    parentPath: '/collections/design-pattern-collection',
  },
  'metro-tiles': {
    slug: 'metro-tiles',
    path: '/collections/design-pattern-collection/metro-tiles',
    type: 'product_cat',
    title: 'Metro Tiles',
    parentPath: '/collections/design-pattern-collection',
  },
  'maxi-chequerboard-tiles': {
    slug: 'maxi-chequerboard-tiles',
    path: '/collections/design-pattern-collection/maxi-chequerboard-tiles',
    type: 'product_cat',
    title: 'Maxi Chequerboard Tiles',
    parentPath: '/collections/design-pattern-collection',
  },
  'octagon-cabochon-tiles': {
    slug: 'octagon-cabochon-tiles',
    path: '/collections/design-pattern-collection/octagon-cabochon-tiles',
    type: 'product_cat',
    title: 'Octagon & Cabochon Tiles',
    parentPath: '/collections/design-pattern-collection',
  },
  'triangle-tiles': {
    slug: 'triangle-tiles',
    path: '/collections/design-pattern-collection/triangle-tiles',
    type: 'product_cat',
    title: 'Triangle Tiles',
    parentPath: '/collections/design-pattern-collection',
  },
};

/**
 * Get URL path for a slug
 */
export function getCollectionPath(slug: string): string {
  return URL_MAPPINGS[slug]?.path || `/category/${slug}`;
}

/**
 * Get slug from URL path
 */
export function getSlugFromPath(path: string): string | null {
  const mapping = Object.values(URL_MAPPINGS).find(m => m.path === path);
  return mapping?.slug || null;
}

/**
 * Get collection type from slug
 */
export function getCollectionType(slug: string): CollectionType {
  return URL_MAPPINGS[slug]?.type || 'product_cat';
}

/**
 * Get title from slug
 */
export function getCollectionTitle(slug: string): string {
  return URL_MAPPINGS[slug]?.title || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get parent path from slug (for breadcrumbs)
 */
export function getParentPath(slug: string): string | undefined {
  return URL_MAPPINGS[slug]?.parentPath;
}
