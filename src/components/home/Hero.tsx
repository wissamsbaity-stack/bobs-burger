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
    <section className="relative -mt-[var(--site-header-height)] overflow-hidden bg-ink bg-hero-radial pt-[var(--site-header-height)]">
      {/* Layered orange glow — large, soft, fades naturally into the dark bg */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_15%,rgba(255,92,0,0.10)_0%,rgba(255,92,0,0.04)_50%,transparent_85%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,92,0,0.06)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-14 pt-10 text-center sm:px-6 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative shrink-0"
        >
          <div className="absolute inset-0 rounded-full bg-accent/25 blur-[60px]" />
          <div className="relative h-20 w-20 overflow-hidden rounded-3xl shadow-ember ring-1 ring-white/10 sm:h-24 sm:w-24">
            <Image
              src={settings.branding.logo}
              alt={settings.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 80px, 96px"
            />
          </div>
        </m.div>

        <m.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-8 font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream sm:mt-10 sm:text-5xl lg:text-6xl"
        >
          Burgers built for serious cravings.
        </m.h1>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:justify-center sm:gap-4"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-base font-semibold text-white transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.97]"
          >
            <MessageCircle className="h-5 w-5" />
            Order on WhatsApp
          </a>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/[0.03] px-7 py-4 text-base font-semibold text-cream shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-300 ease-out hover:border-accent/50 hover:bg-accent/10 hover:text-cream hover:shadow-[0_0_24px_rgba(255,92,0,0.22)] active:scale-[0.97]"
          >
            Browse the menu
          </Link>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mt-10 w-full sm:mt-12"
          style={{
            paddingBottom: "max(0px, env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div
            className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-accent/20 blur-3xl"
            aria-hidden
          />
          {/* Fixed 16:9 box reserves height before the image paints — prevents CLS */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 shadow-ember ring-1 ring-white/5">
            <Image
              src={heroImage}
              alt={`${settings.name} restaurant`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </m.div>
      </div>
    </section>
  );
}
