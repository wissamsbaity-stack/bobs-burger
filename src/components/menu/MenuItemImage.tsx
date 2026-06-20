"use client";

import { useState } from "react";
import Image from "next/image";
import { useSettings } from "@/contexts/SettingsContext";
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
  const settings = useSettings();
  const fallback = settings.branding.logo;

  const [loaded, setLoaded] = useState(false);
  // If the item image fails (or is missing), fall back to the restaurant logo
  // so a card never renders an empty black box.
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-overlay",
        compact
          ? "h-20 w-20 shrink-0 rounded-lg"
          : "aspect-square w-full",
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
        src={currentSrc}
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
          "object-cover transition-[opacity,transform,filter] duration-300 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          "motion-safe:md:group-hover:scale-[1.04]",
          "motion-safe:md:group-hover:brightness-[1.05]"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== fallback) {
            setCurrentSrc(fallback);
          } else {
            setLoaded(true);
          }
        }}
      />
    </div>
  );
}
