/**
 * Maps category slugs to their corresponding material names from WooCommerce
 * Used for smart filtering on collection pages
 *
 * IMPORTANT: Material names must match EXACTLY as they appear in WooCommerce attributes
 */
export const CATEGORY_MATERIAL_MAP: Record<string, string> = {
  // Stone Collection - Material-based categories
  // Format: 'category-slug': 'Exact Material Name from WooCommerce'
  'marble-tiles': 'Marble Tiles',
  'travertine-tiles': 'Travertine Tiles',
  'limestone-tiles': 'Limestone Tiles',
  'slate-tiles': 'Slate Tiles',
  'granite-tiles': 'Granite Tiles',

  // Other material-based collections
  'clay-brick-slips': 'Brick Slips',
  'stone-pavers': 'Stone Paver',
  'mouldings-skirtings': 'Mouldings & Skirtings', // Decoded from &amp;
  'marble-mosaic-tiles': 'Marble Mosaic Tiles',
  'mosaic-tiles': 'Marble Mosaic Tiles', // Alias

  // Porcelain collection
  'porcelain-collection': 'Porcelain Stone',
  'stone-effect-tiles-porcelain-collection': 'Porcelain Stone',

  // Note: Design pattern collections (herringbone, hexagon, etc.) should NOT be in this map
  // as they need to show ALL material options for filtering
};

/**
 * Gets the material name for a given category slug
 * Returns undefined if the category doesn't have a locked material
 */
export function getMaterialForCategory(categorySlug: string): string | undefined {
  return CATEGORY_MATERIAL_MAP[categorySlug];
}