"use client";

import { cn } from "@/lib/utils";

interface HeroNavigationProps {
  totalSlides: number;
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

export function HeroNavigation({
  totalSlides,
  currentSlide,
  onSlideChange,
}: HeroNavigationProps) {
  return (
    <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
      <span className="text-sm font-medium text-porcelain/80">
        {String(currentSlide + 1).padStart(2, "0")}
      </span>

      <div className="flex gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              index === currentSlide
                ? "w-12 bg-porcelain"
                : "w-8 bg-porcelain/40 hover:bg-porcelain/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <span className="text-sm font-medium text-porcelain/80">
        {String(totalSlides).padStart(2, "0")}
      </span>
    </div>
  );
}