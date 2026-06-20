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

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:py-24">
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-7xl"
        >
          Burgers built for serious cravings.
        </m.h1>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center sm:gap-4"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-base font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5" />
            Order on WhatsApp
          </a>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 text-base font-semibold text-cream transition-colors hover:border-white/40 hover:bg-white/5"
          >
            Browse the menu
          </Link>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mt-12 w-full sm:mt-14"
        >
          <div
            className="absolute -inset-4 rounded-[2rem] bg-accent/20 blur-3xl"
            aria-hidden
          />
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
              className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
              aria-hidden
            />
          </div>
        </m.div>
      </div>
    </section>
  );
}
