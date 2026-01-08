import { CategoryGrid } from '../components/layout/category-grid/CategoryGrid';
import { CategoryGridSection } from '@/types/category-grid';
import { Breadcrumb, type BreadcrumbItem } from '@/app/components/layout/breadcrumb';

const categorySection: CategoryGridSection = {
  subheading: "Explore Our Collection",
  heading: "All Categories",
  categories: [
    {
      id: "cat-1",
      title: "Marble Tiles",
      subtitle: "Timeless Elegance",
      description: "Luxury marble tiles for sophisticated interiors",
      image: "/images/marbleTiles.webp",
      link: "/category/marble-tiles",
      featured: true,
      theme: "light",
    },
    {
      id: "cat-2",
      title: "Limestone Tiles",
      subtitle: "Natural Warmth",
      description: "Warm and inviting limestone for any space",
      image: "/images/limestoneTiles.avif",
      link: "/category/limestone-tiles",
      theme: "dark",
    },
    {
      id: "cat-3",
      title: "Travertine Tiles",
      subtitle: "Classic Beauty",
      description: "Traditional travertine with modern applications",
      image: "/images/travertineTiles.webp",
      link: "/category/travertine-tiles",
      theme: "light",
    },
    {
      id: "cat-4",
      title: "Slate Tiles",
      subtitle: "Rugged Character",
      description: "Durable slate tiles with natural texture",
      image: "/images/slateTiles.webp",
      link: "/category/slate-tiles",
      theme: "dark",
    },
    {
      id: "cat-5",
      title: "Stone Slabs",
      subtitle: "Premium Quality",
      description: "Large format stone slabs for custom projects",
      image: "/images/slabs.webp",
      link: "/category/stone-slabs",
      featured: true,
      theme: "light",
    },
    {
      id: "cat-6",
      title: "Herringbone Tiles",
      subtitle: "Distinctive Pattern",
      description: "Elegant herringbone pattern tiles",
      image: "/images/herringbone.webp",
      link: "/category/herringbone-tiles",
      theme: "dark",
    },
  ],
};

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Categories' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={breadcrumbItems} />
      <div className="container mx-auto py-12">
        <CategoryGrid section={categorySection} />
      </div>
    </div>
  );
}
