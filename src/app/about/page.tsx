import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteSettings } from "@/lib/settings/site-settings";
import { formatFullAddress } from "@/lib/settings/helpers";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "About",
    description: `Learn about ${settings.name} — ${settings.tagline || settings.metaDescription}`,
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppContactUrl(
    undefined,
    settings.whatsapp,
    settings.name
  );
  const fullAddress = formatFullAddress(settings.address);
  const locationLine = [settings.address.city, settings.address.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="pb-20">
      <section className="border-b border-white/5 bg-surface-raised py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our story"
            title={settings.name}
            description={settings.legalName}
            align="center"
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-ember">
            <Image
              src={settings.branding.cover}
              alt={settings.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted">
              {locationLine
                ? `Based in ${locationLine}, ${settings.name} serves char-grilled beef burgers, premium black Angus stacks, Nashville-fried chicken, loaded sides, wraps, and value meals — all made to order.`
                : `${settings.name} serves char-grilled beef burgers, premium black Angus stacks, Nashville-fried chicken, loaded sides, wraps, and value meals — all made to order.`}
            </p>
            <p className="leading-relaxed text-muted">
              {settings.tagline}. Order through WhatsApp for fast delivery across
              the area.
            </p>

            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-surface-raised p-5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="font-semibold text-cream">Location</p>
                <p className="text-sm text-muted">{fullAddress}</p>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-5 w-5" />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
