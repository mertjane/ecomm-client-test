// WooCommerce Product from API
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  stock_status: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  images: Array<{ id: number; src: string; alt: string }>;
  attributes: any[];
  variations: any[];
  yoast_head_json: {
    og_image: Array<{ url: string }>;
  };
}

// Frontend SpecialDeal type (transformed from WooCommerce)
export interface SpecialDeal {
  id: string;
  title: string;
  category?: string;
  image: string;
  link: string;
  originalPrice: number;
  discountPrice: number;
  badgeType?: 'hot' | 'flash' | 'limited' | 'discount';
  badgeText?: string;
  expiresAt?: string; // ISO string format for Redux serialization
  stock?: number;
}

export interface SpecialDealsSection {
  title?: string;
  subtitle?: string;
  deals: SpecialDeal[];
}

export interface SpecialDealApiResponse {
  success: boolean;
  message: string;
  products: WooCommerceProduct[];
  meta: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_products: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

export interface SpecialDealState {
  data: SpecialDeal[] | null;
  isLoading: boolean;
  error: string | null;
}