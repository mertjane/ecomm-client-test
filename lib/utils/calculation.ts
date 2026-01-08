/**
 * Parse size variation (e.g., "300x300x16") and extract dimensions in mm
 */
interface TileDimensions {
  width: number;  // in mm
  length: number; // in mm
  thickness: number; // in mm
}

export function parseTileSize(sizeString: string): TileDimensions | null {
  if (!sizeString) return null;

  // Match patterns like "300x300x16", "600x300x20", etc.
  const match = sizeString.match(/(\d+)\s*x\s*(\d+)\s*x\s*(\d+)/i);

  if (match) {
    return {
      width: parseInt(match[1]),
      length: parseInt(match[2]),
      thickness: parseInt(match[3]),
    };
  }

  return null;
}

/**
 * Calculate area of a single tile in square meters
 */
export function calculateTileArea(dimensions: TileDimensions): number {
  // Convert mm to meters and calculate area
  const widthInMeters = dimensions.width / 1000;
  const lengthInMeters = dimensions.length / 1000;
  return widthInMeters * lengthInMeters;
}

/**
 * Convert quantity (number of tiles) to square meters
 */
export function quantityToSqm(quantity: number, tileSize: string): number {
  const dimensions = parseTileSize(tileSize);
  if (!dimensions) return 0;

  const areaPerTile = calculateTileArea(dimensions);
  return parseFloat((quantity * areaPerTile).toFixed(2));
}

/**
 * Convert square meters to quantity (number of tiles)
 * Rounds up to ensure enough tiles
 */
export function sqmToQuantity(sqm: number, tileSize: string): number {
  const dimensions = parseTileSize(tileSize);
  if (!dimensions) return 1;

  const areaPerTile = calculateTileArea(dimensions);
  return Math.ceil(sqm / areaPerTile);
}

/**
 * Get the minimum SQM increment based on tile size
 */
export function getMinSqmIncrement(tileSize: string): number {
  const dimensions = parseTileSize(tileSize);
  if (!dimensions) return 0.5;

  return calculateTileArea(dimensions);
}
