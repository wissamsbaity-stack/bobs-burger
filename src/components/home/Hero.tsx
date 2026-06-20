"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "@/lib/motion";
import { MessageCircle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

export function Hero() {
  const settings = useSettings();
  const whatsappUrl = buildWhatsAppContactUrl(
    undefined,
    settings.whatsapp,
    settings.name
  );

  const heroImage = settings.branding.heroImage || settings.branding.logo;

  return (
    <section className="relative overflow-hidden bg-ink bg-hero-radial">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,92,0,0.08)_0%,transparent_65%)]" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-16 lg:py-20">
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative shrink-0"
        >
          <div className="absolute inset-0 rounded-full bg-accent/25 blur-[60px]" />
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl shadow-ember ring-1 ring-white/10 sm:h-20 sm:w-20">
            <Image
              src={settings.branding.logo}
              alt={settings.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 64px, 80px"
            />
          </div>
        </m.div>

        <m.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-5 font-display text-3xl font-bold leading-[1.05] tracking-tight text-cream sm:mt-6 sm:text-5xl lg:text-6xl"
        >
          Burgers built for serious cravings.
        </m.h1>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 flex w-full flex-col gap-2.5 sm:mt-6 sm:w-auto sm:flex-row sm:justify-center sm:gap-3"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:px-7 sm:py-3.5 sm:text-base"
          >
            <MessageCircle className="h-5 w-5" />
            Order on WhatsApp
          </a>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:border-white/40 hover:bg-white/5 sm:px-7 sm:py-3.5 sm:text-base"
          >
            Browse the menu
          </Link>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mt-6 w-full sm:mt-8"
        >
          <div
            className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-accent/20 blur-3xl sm:-inset-4"
            aria-hidden
          />
          {/* Fixed 16:9 box reserves height before the image paints — prevents CLS */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-ember ring-1 ring-white/5 sm:rounded-3xl">
            <Image
              src={heroImage}
              alt={`${settings.name} restaurant`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
              aria-hidden
            />
          </div>
        </m.div>
      </div>
    </section>
  );
}
