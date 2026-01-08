import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroContentProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  theme?: "light" | "dark";
}

export function HeroContent({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  theme = "dark",
}: HeroContentProps) {
  return (
    <div className="relative z-10 flex h-full items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          {subtitle && (
            <p className="subheading text-base sm:text-lg md:text-xl text-white/90">
              {subtitle}
            </p>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-[0.95] tracking-tight text-white">
            {title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl max-w-xl font-normal leading-relaxed text-white/80">
            {description}
          </p>

          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="group h-12 px-8 text-sm uppercase tracking-wider bg-white text-granite hover:bg-white/90"
            >
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}