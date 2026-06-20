"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { RestaurantBrand } from "@/components/layout/RestaurantBrand";
import {
  formatFullAddress,
  instagramHandleFromUrl,
} from "@/lib/settings/helpers";

export function Footer() {
  const settings = useSettings();
  const fullAddress = formatFullAddress(settings.address);
  const instagramHandle = instagramHandleFromUrl(settings.social.instagram);

  return (
    <footer className="border-t border-white/5 bg-surface-raised">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <RestaurantBrand size="sm" />
            <p className="text-sm leading-relaxed text-muted">
              {settings.address.city ? `${settings.address.city}. ` : ""}
              {settings.tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/menu", label: "Menu" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">
              Hours
            </h3>
            <ul className="space-y-2">
              {settings.hours.map((slot) => (
                <li
                  key={`${slot.days}-${slot.time}`}
                  className="flex items-start gap-2 text-sm text-muted"
                >
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
                  <span>
                    <span className="text-cream/80">{slot.days}</span>
                    <br />
                    {slot.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                >
                  <Phone className="h-4 w-4 text-accent/70" />
                  {settings.phone}
                </a>
              </li>
              {settings.phoneSecondary ? (
                <li>
                  <a
                    href={`tel:${settings.phoneSecondary.replace(/\D/g, "")}`}
                    className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <Phone className="h-4 w-4 text-accent/70" />
                    {settings.phoneSecondary}
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4 text-accent/70" />
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
                {fullAddress}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {settings.legalName}
          </p>
          <div className="flex items-center gap-4">
            {settings.social.instagram ? (
              <a
                href={settings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted transition-colors hover:text-accent"
              >
                {instagramHandle}
              </a>
            ) : null}
            {settings.social.facebook ? (
              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted transition-colors hover:text-accent"
              >
                Facebook
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
