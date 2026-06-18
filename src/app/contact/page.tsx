import type { Metadata } from "next";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteSettings } from "@/lib/settings/site-settings";
import {
  formatFullAddress,
  mapsEmbedUrlFromAddress,
} from "@/lib/settings/helpers";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Contact",
    description: `Get in touch with ${settings.name}. Find our location, hours, and contact details.`,
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const fullAddress = formatFullAddress(settings.address);
  const whatsappUrl = buildWhatsAppContactUrl(
    `Hi ${settings.name}! I have a question.`,
    settings.whatsapp,
    settings.name
  );
  const mapEmbedUrl = mapsEmbedUrlFromAddress(settings.address);

  return (
    <div className="pb-20">
      <section className="border-b border-cream/5 bg-surface-raised/30 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Get in Touch"
            title="We'd love to hear from you"
            description="Questions about your order, catering, or just want to say hi? Reach out anytime."
            align="center"
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Phone,
                  label: "Phone",
                  value: settings.phone,
                  href: `tel:${settings.phone.replace(/\D/g, "")}`,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: settings.email,
                  href: `mailto:${settings.email}`,
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: fullAddress,
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: settings.whatsapp,
                  href: whatsappUrl,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-cream/5 bg-surface-raised p-5"
                >
                  <item.icon className="mb-3 h-5 w-5 text-accent" />
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.label === "WhatsApp" ? "_blank" : undefined}
                      rel={
                        item.label === "WhatsApp"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-sm font-medium text-cream transition-colors hover:text-accent"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-cream">
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-cream/5 bg-surface-raised p-6">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-cream">Opening Hours</h3>
              </div>
              <ul className="space-y-3">
                {settings.hours.map((slot) => (
                  <li
                    key={`${slot.days}-${slot.time}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-cream/60">{slot.days}</span>
                    <span className="font-medium text-cream">{slot.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" size="lg" className="w-full sm:w-auto">
                <MessageCircle className="h-5 w-5" />
                Message on WhatsApp
              </Button>
            </a>
          </div>

          <ContactForm />
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-cream/5">
          <iframe
            title={`${settings.name} location`}
            src={mapEmbedUrl}
            className="h-80 w-full grayscale-[30%] invert-[90%] contrast-[90%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
