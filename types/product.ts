export interface ProductMeta {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_products: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface ProductImage {
  id: number;
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  src: string;
  name: string;
  alt: string;
  srcset?: string;
  sizes?: string;
  thumbnail?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  slug?: string;
  position?: number;
  visible?: boolean;
  variation?: boolean;
  options: string[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  price?: string;
  regular_price?: string;
  sale_price?: string;
  price_html: string; // This will hold the cleaned numeric string from your regex
  stock_status: "instock" | "outofstock" | "onbackorder";
  categories: ProductCategory[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  variations?: number[];
  yoast_head_json: {
    og_image: {
      url: string;
      width: number;
      height: number;
      type: string;
    }[];
  };
}


export interface ProductResponse {
  category: { id: number; name: string; slug: string };
  products: Product[];
  meta: ProductMeta;
}

// Filter Types
export interface FilterOption {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface FilterOptions {
  pa_material: FilterOption[];
  'pa_room-type-usage': FilterOption[];
  pa_colour: FilterOption[];
  pa_finish: FilterOption[];
}

export interface FilterOptionsResponse {
  success: boolean;
  data: FilterOptions;
}

export type SortOption = 'date' | 'popularity' | 'title' | 'price' | 'price-desc';