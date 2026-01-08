// types/category-grid.ts
export interface CategoryCard {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link: string;
  featured?: boolean;
  theme?: 'light' | 'dark';
}

export interface CategoryGridSection {
  heading?: string;
  subheading?: string;
  categories: CategoryCard[];
}