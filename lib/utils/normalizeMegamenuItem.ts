import { MegamenuItem } from '@/types/megamenu';

/**
 * Converts external URLs (karakedi.xyz) to local paths
 */
function convertToLocalUrl(externalUrl: string): string {
  if (!externalUrl) return '/';

  try {
    const url = new URL(externalUrl);
    // Extract pathname from the external URL
    const pathname = url.pathname;

    // Remove trailing slashes
    const cleanPath = pathname.replace(/\/$/, '');

    // Return the local path
    return cleanPath || '/';
  } catch (error) {
    // If URL parsing fails, return as-is
    return externalUrl;
  }
}

export function normalizeMegamenuItem(item: any): MegamenuItem {
  const localUrl = convertToLocalUrl(item.url);

  return {
    id: item.id,
    title: item.title,
    url: localUrl,
    slug: localUrl.split('/').filter(Boolean).pop() || item.id.toString(),
    children: item.children?.map(normalizeMegamenuItem) || [],
  };
}

