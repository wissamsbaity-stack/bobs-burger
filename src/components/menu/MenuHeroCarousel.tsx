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

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("//");
}

function BannerCta({ text, link }: { text: string; link: string | null }) {
  const className =
    "menu-banner-cta pointer-events-auto inline-flex min-h-10 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold text-white sm:min-h-11 sm:px-6 sm:text-[15px]";

  if (link?.trim()) {
    const href = link.trim();
    if (isExternalHref(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {text}
        </a>
      );
    }

    return (
      <Link href={href} className={className}>
        {text}
      </Link>
    );
  }

  return <span className={cn(className, "cursor-default opacity-95")}>{text}</span>;
}

function BannerSlideContent({ banner }: { banner: MenuBanner }) {
  const hasText = Boolean(banner.title || banner.subtitle || banner.ctaText);
  if (!hasText) return null;

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-full items-center px-5 sm:px-8 lg:px-10">
      <div className="relative max-w-[min(100%,34rem)]">
        <div
          className="menu-banner-text-shade absolute -inset-x-5 -inset-y-4 rounded-2xl sm:-inset-x-6 sm:-inset-y-5"
          aria-hidden
        />
        <div className="relative space-y-2 sm:space-y-2.5">
          {banner.title ? (
            <h2 className="text-balance text-xl font-bold leading-tight tracking-tight text-cream sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
              {banner.title}
            </h2>
          ) : null}
          {banner.subtitle ? (
            <p className="max-w-prose text-pretty text-sm leading-relaxed text-cream/85 sm:text-base sm:leading-relaxed">
              {banner.subtitle}
            </p>
          ) : null}
          {banner.ctaText ? (
            <div className={cn(banner.subtitle ? "pt-1.5 sm:pt-2" : banner.title ? "pt-0.5" : "")}>
              <BannerCta text={banner.ctaText} link={banner.ctaLink} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
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
          <div className="relative aspect-[2.35/1] max-h-[240px] w-full sm:max-h-[280px] lg:max-h-[340px]">
            <AnimatePresence mode="wait">
              <m.div
                key={active.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
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
                <BannerSlideContent banner={active} />
              </m.div>
            </AnimatePresence>
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
