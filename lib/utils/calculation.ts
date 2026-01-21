/**
 * Parse size variation (e.g., "300x300x16") and extract dimensions in mm
 * For mosaic tiles like "49x49x10 (305x305x10)", uses the parentheses dimensions
 */
interface TileDimensions {
  width: number;  // in mm
  length: number; // in mm
  thickness: number; // in mm
}

/**
 * Check if a variation name indicates a mosaic product
 * Mosaic formats: "49x49x10 (305x305x10)", "Free Sample (49x49) (100x100) (MM)"
 */
export function isMosaicVariation(name: string): boolean {
  if (!name) return false;
  // Mosaic tiles have dimensions inside parentheses
  return /\(\d+\s*x\s*\d+/.test(name);
}

/**
 * Extract dimensions from mosaic variation name
 * For "49x49x10 (305x305x10)" returns [305, 305]
 * For "Free Sample (49x49) (100x100) (MM)" returns [100, 100] (last numeric parentheses)
 */
export function extractMosaicDimensions(name: string): [number, number] | null {
  if (!name) return null;

  // Find all parentheses with dimensions (NxN format)
  const matches = [...name.matchAll(/\((\d+)\s*x\s*(\d+)(?:\s*x\s*\d+)?\)/gi)];

  if (matches.length === 0) return null;

  // For mosaic tiles, use the last numeric parentheses (sheet size, not individual tile)
  // "49x49x10 (305x305x10)" -> use 305x305
  // "Free Sample (49x49) (100x100) (MM)" -> use 100x100 (last one with numbers)
  const lastMatch = matches[matches.length - 1];

  return [parseInt(lastMatch[1]), parseInt(lastMatch[2])];
}

export function parseTileSize(sizeString: string): TileDimensions | null {
  if (!sizeString) return null;

  // Check if it's a mosaic tile (has dimensions in parentheses)
  if (isMosaicVariation(sizeString)) {
    const mosaicDims = extractMosaicDimensions(sizeString);
    if (mosaicDims) {
      // Try to extract thickness from parentheses if available (e.g., "305x305x10")
      const thicknessMatch = sizeString.match(/\(\d+\s*x\s*\d+\s*x\s*(\d+)\)/i);
      return {
        width: mosaicDims[0],
        length: mosaicDims[1],
        thickness: thicknessMatch ? parseInt(thicknessMatch[1]) : 10, // default thickness
      };
    }
  }

  // Standard format: "300x300x16", "600x300x20", etc.
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
  return parseFloat((quantity * areaPerTile).toFixed(3));
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
