/**
 * Maps parent colour groups to their related colour variants
 * Used for automatically including related colours in filtering
 *
 * Example: When user visits /colour/whites,
 * we should show products from white, ivory-cream, AND ivory
 */
export const COLOUR_GROUPS: Record<string, string[]> = {
  whites: ['white', 'ivory-cream', 'ivory'],
  blacks: ['black'],
  greys: ['grey'],
  'beiges-browns': ['beige', 'brown', 'sand'],
  'blues-greens': ['blue', 'green'],
  'creams-yellows': ['cream', 'gold', 'yellow'],
  'reds-pinks': ['red', 'pink'],
  'multicolors-patterns': ['black-and-white', 'purple', 'orange', 'multicolor'],
};

/**
 * Gets all related colour slugs for a given parent colour group
 * Returns the slug itself if no grouping exists
 */
export function getRelatedColours(colourSlug: string): string[] {
  // Check if this slug has related colours
  if (COLOUR_GROUPS[colourSlug]) {
    return COLOUR_GROUPS[colourSlug];
  }

  // Check if this slug is part of a group
  for (const [groupSlug, colours] of Object.entries(COLOUR_GROUPS)) {
    if (colours.includes(colourSlug)) {
      return COLOUR_GROUPS[groupSlug];
    }
  }

  // No grouping, return the slug itself
  return [colourSlug];
}

/**
 * Gets the display name for a colour group
 */
export function getColourGroupName(colourSlug: string): string {
  const nameMap: Record<string, string> = {
    whites: 'Whites',
    blacks: 'Blacks',
    greys: 'Greys',
    'beiges-browns': 'Beiges & Browns',
    'blues-greens': 'Blues & Greens',
    'creams-yellows': 'Creams & Yellows',
    'reds-pinks': 'Reds & Pinks',
    'multicolors-patterns': 'Multicolors & Patterns',
  };

  // If it's a known group, return the mapped name
  if (nameMap[colourSlug]) {
    return nameMap[colourSlug];
  }

  // Otherwise return formatted slug with proper handling of 'and'
  return colourSlug
    .split('-')
    .map((word) => {
      if (word === 'and') return '&';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
