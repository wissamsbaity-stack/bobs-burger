"use client";

import Link from "next/link";
import { m } from "@/lib/motion";
import { MessageCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSettings } from "@/contexts/SettingsContext";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

export function OrderCTA() {
  const settings = useSettings();
  const whatsappUrl = buildWhatsAppContactUrl(
    undefined,
    settings.whatsapp,
    settings.name
  );

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-surface-raised to-ink p-8 md:p-12"
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-bold text-cream md:text-4xl">
                Hungry? Order in 3 taps.
              </h2>
              <p className="text-muted">
                Build your cart, add your delivery details
                {settings.address.city ? ` in ${settings.address.city}` : ""}, and
                send your order straight to our kitchen via WhatsApp.
              </p>
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Truck className="h-5 w-5 text-accent" />
                  Fast delivery
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <MessageCircle className="h-5 w-5 text-accent" />
                  WhatsApp ordering
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="whatsapp" size="lg" className="w-full">
                  <MessageCircle className="h-5 w-5" />
                  Order on WhatsApp
                </Button>
              </a>
              <Link href="/menu" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Browse Menu
                </Button>
              </Link>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
