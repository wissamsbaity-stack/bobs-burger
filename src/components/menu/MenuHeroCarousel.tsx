"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type RefObject } from "react";
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

function BannerCaption({ caption }: { caption: string }) {
  return (
    <p className="menu-banner-caption pointer-events-none absolute bottom-0 left-0 z-10 max-w-[min(100%,28rem)] px-5 pb-5 text-base font-bold leading-snug text-white sm:px-7 sm:pb-6 sm:text-lg">
      {caption}
    </p>
  );
}

function BannerSlide({
  banner,
  priority,
  swipeLockRef,
}: {
  banner: MenuBanner;
  priority: boolean;
  swipeLockRef: RefObject<boolean>;
}) {
  const clickLink = banner.clickLink?.trim() || null;
  const caption = banner.caption?.trim() || null;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (swipeLockRef.current) {
      event.preventDefault();
    }
  };

  const inner = (
    <>
      <div className="menu-banner-ken-burns absolute inset-0 overflow-hidden">
        <Image
          src={banner.imageUrl}
          alt={caption ?? "Menu banner"}
          fill
          priority={priority}
          className="object-cover"
          style={cropToImageStyle(banner.imageCrop)}
          sizes="(max-width: 768px) 100vw, 1280px"
        />
      </div>
      {caption ? <BannerCaption caption={caption} /> : null}
    </>
  );

  if (clickLink) {
    const interactiveClass =
      "menu-banner-link absolute inset-0 block overflow-hidden cursor-pointer motion-safe:transition-transform motion-safe:duration-200 motion-safe:active:scale-[0.985]";

    if (isExternalHref(clickLink)) {
      return (
        <a
          href={clickLink}
          target="_blank"
          rel="noopener noreferrer"
          className={interactiveClass}
          onClick={handleClick}
          aria-label={caption ?? "Open banner link"}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link
        href={clickLink}
        className={interactiveClass}
        onClick={handleClick}
        aria-label={caption ?? "Open banner link"}
      >
        {inner}
      </Link>
    );
  }

  return <div className="absolute inset-0">{inner}</div>;
}

export function MenuHeroCarousel({ banners, className }: MenuHeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swipeLock = useRef(false);
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
          swipeLock.current = false;
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || count <= 1) return;

          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;

          if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

          swipeLock.current = true;
          window.setTimeout(() => {
            swipeLock.current = false;
          }, 300);

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
                <BannerSlide
                  banner={active}
                  priority={index === 0}
                  swipeLockRef={swipeLock}
                />
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
