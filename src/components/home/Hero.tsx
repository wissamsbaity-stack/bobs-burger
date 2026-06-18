"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, MessageCircle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

export function Hero({ menuItemCount }: { menuItemCount: number }) {
  const settings = useSettings();
  const whatsappUrl = buildWhatsAppContactUrl(
    undefined,
    settings.whatsapp,
    settings.name
  );
  const locationLabel = settings.address.city || settings.address.street;

  return (
    <section className="relative overflow-hidden bg-ink bg-hero-radial">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,92,0,0.06)_0%,transparent_65%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            <Flame className="h-3.5 w-3.5" />
            {locationLabel
              ? `Char-grilled in ${locationLabel} since day one`
              : settings.tagline}
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-6xl xl:text-7xl">
            Burgers built for serious cravings.
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted">
            From classic smash patties to black angus stacks and Nashville-fried
            chicken — every bite at {settings.name} is fire-grilled, loaded, and
            made to order.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              Order on WhatsApp
            </a>
            <Link
              href="/menu"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Browse the menu
            </Link>
          </div>

          <div className="flex flex-wrap gap-10 border-t border-white/5 pt-8">
            {[
              { value: `${menuItemCount}+`, label: "Menu items" },
              { value: "5★", label: "Customer rated" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold text-accent">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-[100px]" />
          <div className="relative aspect-square overflow-hidden rounded-3xl shadow-ember">
            <Image
              src={settings.branding.heroBurger}
              alt={`${settings.name} signature stack`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
