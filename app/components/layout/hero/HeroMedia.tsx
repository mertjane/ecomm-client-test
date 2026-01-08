"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HeroMediaProps {
  mediaType: "image" | "video";
  mediaSrc: string;
  mediaPoster?: string;
  alt: string;
  priority?: boolean;
}

export function HeroMedia({
  mediaType,
  mediaSrc,
  mediaPoster,
  alt,
  priority = false,
}: HeroMediaProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (mediaType === "video") {
    return (
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={mediaPoster}
          className="h-full w-full object-cover"
          onLoadedData={() => setIsLoading(false)}
        >
          <source src={mediaSrc} type="video/mp4" />
        </video>
        {isLoading && mediaPoster && (
          <Image
            src={mediaPoster}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Image
        src={mediaSrc}
        alt={alt}
        fill
        priority={priority}
        className={cn(
          "object-cover transition-all duration-700",
          isLoading ? "scale-110 blur-sm" : "scale-100 blur-0"
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}