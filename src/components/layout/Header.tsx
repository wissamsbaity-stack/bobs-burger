"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { m, AnimatePresence } from "@/lib/motion";
import { useOverlayLock } from "@/lib/overlay-store";
import { RestaurantBrand } from "@/components/layout/RestaurantBrand";
import { useSettings } from "@/contexts/SettingsContext";
import { getGoogleMapsUrl } from "@/lib/settings/helpers";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/contact", label: "Contact" },
];

const mobileNavItems: {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  external?: boolean;
}[] = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "menu", label: "Menu", icon: UtensilsCrossed, href: "/menu" },
  { id: "contact", label: "Contact", icon: MessageCircle, href: "/contact" },
  { id: "location", label: "Location", icon: MapPin, href: "", external: true },
];

const panelSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

function MobileNavLink({
  href,
  label,
  icon: Icon,
  active,
  external,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  external?: boolean;
  onNavigate: () => void;
}) {
  const className = cn(
    "flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium transition-colors motion-safe:active:scale-[0.98]",
    active
      ? "bg-accent-muted text-accent"
      : "text-muted hover:text-cream"
  );

  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
      {label}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onNavigate} className={className}>
      {content}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const settings = useSettings();
  const mapsUrl = getGoogleMapsUrl(settings);

  useOverlayLock(mobileOpen);

  const closeMobile = () => setMobileOpen(false);

  const items = mobileNavItems.map((item) =>
    item.external ? { ...item, href: mapsUrl } : item
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[var(--site-header-height)] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className={cn("min-w-0", mobileOpen && "max-md:hidden")}>
            <RestaurantBrand />
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-colors motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]",
                  pathname === link.href
                    ? "bg-accent-muted text-accent"
                    : "text-muted hover:text-cream"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center md:hidden">
            {!mobileOpen ? (
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-cream motion-safe:transition-transform motion-safe:duration-150 motion-safe:active:scale-90"
                aria-label="Open menu"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <m.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/55 md:hidden"
              onClick={closeMobile}
            />
            <m.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={panelSpring}
              className="fixed inset-x-0 top-[var(--site-header-height)] z-50 border-b border-white/5 bg-ink/[0.98] shadow-lg shadow-black/30 backdrop-blur-xl md:hidden"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3">
                <RestaurantBrand asLink={false} className="min-w-0" />
                <button
                  type="button"
                  onClick={closeMobile}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-cream motion-safe:transition-transform motion-safe:duration-150 motion-safe:active:scale-90"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
                {items.map((item, index) => (
                  <m.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.04 + index * 0.04,
                      duration: 0.22,
                      ease: "easeOut",
                    }}
                  >
                    <MobileNavLink
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      external={item.external}
                      active={!item.external && pathname === item.href}
                      onNavigate={closeMobile}
                    />
                  </m.div>
                ))}
              </div>
            </m.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
