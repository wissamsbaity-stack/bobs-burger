"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "@/lib/motion";
import { cropToImageStyle } from "@/lib/image-crop";
import { cn } from "@/lib/utils";
import type { MenuBanner } from "@/types/banner";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

interface MenuHeroCarouselProps {
  banners: MenuBanner[];
  className?: string;
}

export function MenuHeroCarousel({ banners, className }: MenuHeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const paused = useRef(false);

  const count = banners.length;
  const active = banners[index];

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (count <= 1) return;
    if (paused.current) return;

    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, goNext, index]);

  if (!active) return null;

  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      <div
        className="group"
        onMouseEnter={() => {
          paused.current = true;
        }}
        onMouseLeave={() => {
          paused.current = false;
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || count <= 1) return;

          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;

          if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

          if (dx < 0) goNext();
          else goPrev();
        }}
      >
        <div className="menu-hero-carousel relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-ink shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55),0_0_40px_-8px_rgba(255,92,0,0.18)]">
          <div className="relative aspect-[2.35/1] max-h-[200px] w-full sm:max-h-[240px] lg:max-h-[280px]">
            <AnimatePresence mode="wait">
              <m.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                <div className="menu-banner-ken-burns absolute inset-0 overflow-hidden">
                  <Image
                    src={active.imageUrl}
                    alt={active.title ?? "Menu banner"}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    style={cropToImageStyle(active.imageCrop)}
                    sizes="(max-width: 768px) 100vw, 1280px"
                  />
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent"
                  aria-hidden
                />
              </m.div>
            </AnimatePresence>

            {(active.title || active.subtitle || active.ctaText) && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6">
                {active.title ? (
                  <p className="text-lg font-semibold tracking-tight text-cream sm:text-xl">
                    {active.title}
                  </p>
                ) : null}
                {active.subtitle ? (
                  <p className="mt-0.5 max-w-lg text-sm text-cream/75 sm:text-base">
                    {active.subtitle}
                  </p>
                ) : null}
                {active.ctaText && active.ctaLink ? (
                  <Link
                    href={active.ctaLink}
                    className="pointer-events-auto mt-3 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-transform motion-safe:active:scale-[0.97]"
                  >
                    {active.ctaText}
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {count > 1 ? (
          <div className="mt-3 flex justify-center gap-1.5">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-5 bg-accent shadow-[0_0_8px_rgba(255,92,0,0.55)]"
                    : "w-1.5 bg-white/35 hover:bg-white/55"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
