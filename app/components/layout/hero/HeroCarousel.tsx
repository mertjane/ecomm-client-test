"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlide } from "./HeroSlide";
import { HeroNavigation } from "./HeroNavigation";
import type { HeroSlide as HeroSlideType } from "@/types/hero";

interface HeroCarouselProps {
  slides: HeroSlideType[];
  autoPlay?: boolean;
  interval?: number;
}

export function HeroCarousel({
  slides,
  autoPlay = true,
  interval = 6000,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, nextSlide, slides.length]);

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-granite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <HeroSlide
          key={slide.id}
          slide={slide}
          isActive={index === currentSlide}
          priority={index === 0}
        />
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-20 h-12 w-12 -translate-y-1/2 rounded-full bg-porcelain/10 text-porcelain backdrop-blur-sm transition-all hover:bg-porcelain/20 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-20 h-12 w-12 -translate-y-1/2 rounded-full bg-porcelain/10 text-porcelain backdrop-blur-sm transition-all hover:bg-porcelain/20 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Slide Navigation Dots */}
      {slides.length > 1 && (
        <HeroNavigation
          totalSlides={slides.length}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
        />
      )}
    </div>
  );
}
