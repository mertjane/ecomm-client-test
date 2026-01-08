// WooCommerce Page Types

export interface PageImage {
  url: string;
  width?: number;
  height?: number;
}

export interface Page {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: string;
  content: string;
  excerpt?: string;
  og_image: PageImage[];
}

export interface BlogPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: string;
  excerpt: string;
  content: string;
  og_image: PageImage[];
  categories?: string[];
}

export interface PageApiResponse {
  success: boolean;
  message: string;
  data: Page | BlogPost[];
}

export type PageSlug =
  | 'about-us'
  | 'samples'
  | 'blog'
  | 'reviews'
  | 'contact-us'
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'delivery-information'
  | 'return-refund-policy'
  | 'installation'
  | 'adhevise-grout-advise'
  | 'sealing-and-maintenance';
