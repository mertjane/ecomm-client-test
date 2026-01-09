import { Hero } from "./components/layout/hero/Hero";
import { HeroSlide } from "@/types/hero";
import { CategoryGridSection } from "@/types/category-grid";
import { CategoryGrid } from "./components/layout/category-grid/CategoryGrid";
import { SpecialDealsSection } from "./components/layout/special-deals";
import { PostsGrid } from "./components/layout/posts-grid";
import { NewsletterSection } from "./components/layout/newsletter";
import { MediaAndSponsors } from "./components/layout/media-sponsors/MediaAndSponsors";

const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Herringbone Perfection",
    subtitle: "This Season at Authentic Stone",
    description:
      "Order high-quality herringbone marble tiles for kitchens, bathrooms & beyond.",
    ctaText: "Check It Out!",
    ctaLink: "/collections/design-pattern-collection/herringbone-tiles",
    mediaType: "video",
    mediaSrc: "/videos/hero-christmas.mp4",
    mediaPoster: "/images/herringboneTiles.avif",
    theme: "dark",
  },
  {
    id: "slide-2",
    title: "Marble Chequerboard Tiles",
    subtitle: "Style That Lasts",
    description:
      "Elevate your interiors with the timeless elegance of chequerboard marble tiles — a bold yet classic design that never goes out of style.",
    ctaText: "Explore Now",
    ctaLink: "/collections/design-pattern-collection/chequerboard-tiles",
    mediaType: "image",
    mediaSrc: "/images/chequerboardTiles.avif",
    theme: "light",
  },
  {
    id: "slide-3",
    title: "Luxury with limestone",
    subtitle: "Limestone Living",
    description:
      "Elevate your environment with the natural charm of limestone. Its warm tones and organic textures create serene spaces that balance modern design with timeless elegance. Discover the soft sophistication limestone brings to any setting.",
    ctaText: "Find Out More",
    ctaLink: "/collections/stone-collection/limestone-tiles",
    mediaType: "image",
    mediaSrc: "/images/limestoneTiles.avif",
    theme: "light",
  },
];

const categorySection: CategoryGridSection = {
  subheading: "Explore Our Collection",
  heading: "Premium Stone Selections",
  categories: [
    {
      id: "cat-1",
      title: "Stone Mosaic Tiles",
      subtitle: "Artistic Excellence",
      description: "Create stunning focal points with our handcrafted mosaic tile collections",
      image: "/images/mosaicTiles.webp",
      link: "/collections/mosaic-tiles",
      featured: true,
      theme: "dark",
    },
    {
      id: "cat-2",
      title: "Bathroom Tiles",
      subtitle: "Spa Luxury",
      image: "/images/bathroomTiles.webp",
      link: "/room-type-usage/bathroom",
      theme: "light",
    },
    {
      id: "cat-3",
      title: "Herringbone Tiles",
      subtitle: "Timeless Pattern",
      image: "/images/herringbone.webp",
      link: "/collections/design-pattern-collection/herringbone-tiles",
      theme: "dark",
    },
    {
      id: "cat-4",
      title: "Stone Slabs",
      subtitle: "Natural Beauty",
      image: "/images/slabs.webp",
      link: "/collections/slabs",
      theme: "light",
    },
    {
      id: "cat-5",
      title: "New Arrivals",
      subtitle: "Latest Collection",
      description: "Discover our newest stone tile collections and exclusive designs",
      image: "/images/newArrivals.webp",
      link: "/collections/new-arrivals",
      featured: true,
      theme: "light",
    },
    {
      id: "cat-6",
      title: "Kitchen Tiles",
      subtitle: "Culinary Elegance",
      description: "Heat-resistant and durable stone surfaces designed for the heart of the home.",
      image: "/images/kitchenTiles.webp",
      link: "/room-type-usage/kitchen",
      featured: false,
      theme: "dark",
    },
  ],
};

export default function Home() {
  return (
    <div className=" mx-auto">
      <Hero slides={heroSlides} autoPlay interval={6000} />
      <CategoryGrid section={categorySection} />
      <SpecialDealsSection
        title="Special Deals"
        subtitle="Limited Time Offers"
      />
      <PostsGrid />
      <NewsletterSection />
      <MediaAndSponsors />
    </div>
  );
}
