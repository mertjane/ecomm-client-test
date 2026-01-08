export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  mediaPoster?: string;
  theme?: "light" | "dark";
}

export interface HeroProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
}