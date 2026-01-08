import { HeroCarousel } from "./HeroCarousel";
import type { HeroProps } from "@/types/hero";

export function Hero({ slides, autoPlay = true, interval = 6000 }: HeroProps) {
  return <HeroCarousel slides={slides} autoPlay={autoPlay} interval={interval} />;
}