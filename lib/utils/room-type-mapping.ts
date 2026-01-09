/**
 * Maps parent room type slugs to their related sub-types
 * Used for automatically including related room types in filtering
 *
 * Example: When user visits /room-type-usage/bathroom,
 * we should show products from bathroom-floor AND bathroom-wall
 */
export const ROOM_TYPE_GROUPS: Record<string, string[]> = {
  bathroom: ['bathroom-floor', 'bathroom-wall'],
  kitchen: ['kitchen', 'kitchen-floor', 'kitchen-splashback'],
  'living-room': ['living-room', 'living-room-floor'],
  outdoor: ['outdoor', 'patio'],
  pool: ['pool'],
  'wet-room': ['wet-room'],
};

/**
 * Gets all related room type slugs for a given parent room type
 * Returns the slug itself if no grouping exists
 */
export function getRelatedRoomTypes(roomTypeSlug: string): string[] {
  // Check if this slug has related types
  if (ROOM_TYPE_GROUPS[roomTypeSlug]) {
    return ROOM_TYPE_GROUPS[roomTypeSlug];
  }

  // Check if this slug is a sub-type of a parent (e.g., bathroom-floor -> bathroom)
  const parentSlug = roomTypeSlug.split('-')[0];
  if (ROOM_TYPE_GROUPS[parentSlug]) {
    return ROOM_TYPE_GROUPS[parentSlug];
  }

  // No grouping, return the slug itself
  return [roomTypeSlug];
}

/**
 * Gets the display name for a room type group
 */
export function getRoomTypeGroupName(roomTypeSlug: string): string {
  // If it's a parent with sub-types, return the parent name
  if (ROOM_TYPE_GROUPS[roomTypeSlug]) {
    return roomTypeSlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Otherwise return formatted slug
  return roomTypeSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}