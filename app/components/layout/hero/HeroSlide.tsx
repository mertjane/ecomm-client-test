import { HeroMedia } from "./HeroMedia";
import { HeroContent } from "./HeroContent";
import { cn } from "@/lib/utils";
import type { HeroSlide as HeroSlideType  } from "@/types/hero";

interface HeroSlideProps {
  slide: HeroSlideType;
  isActive: boolean;
  priority?: boolean;
}

export function HeroSlide({ slide, isActive, priority = false }: HeroSlideProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-1000",
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      )}
    >
      {/* Background Overlay - Using brand granite color */}
      <div className="absolute inset-0 bg-gradient-to-r from-granite/60 via-granite/30 to-transparent z-[5]" />

      {/* Media Background */}
      <HeroMedia
        mediaType={slide.mediaType}
        mediaSrc={slide.mediaSrc}
        mediaPoster={slide.mediaPoster}
        alt={slide.title}
        priority={priority}
      />

      {/* Content */}
      <HeroContent
        title={slide.title}
        subtitle={slide.subtitle}
        description={slide.description}
        ctaText={slide.ctaText}
        ctaLink={slide.ctaLink}
        theme={slide.theme}
      />
    </div>
  );
}