"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MenuItemImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  compact?: boolean;
  className?: string;
}

export function MenuItemImage({
  src,
  alt,
  priority = false,
  compact = false,
  className,
}: MenuItemImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-overlay",
        compact
          ? "h-20 w-20 shrink-0 rounded-lg"
          : "aspect-[5/4] w-full sm:aspect-[4/3]",
        className
      )}
    >
      {!loaded ? (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-overlay to-surface-raised"
          aria-hidden
        />
      ) : null}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        sizes={
          compact
            ? "80px"
            : "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
        }
        className={cn(
          "object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          "motion-safe:md:group-hover:scale-[1.03]"
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
