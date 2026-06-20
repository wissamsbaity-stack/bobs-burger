"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { m, AnimatePresence } from "@/lib/motion";
import { useSettings } from "@/contexts/SettingsContext";
import { buildWhatsAppContactUrl } from "@/lib/whatsapp";
import { RestaurantBrand } from "@/components/layout/RestaurantBrand";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/contact", label: "Contact" },
];

const panelSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

export function Header() {
  const pathname = usePathname();
  const settings = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);

  const whatsappUrl = buildWhatsAppContactUrl(
    undefined,
    settings.whatsapp,
    settings.name
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
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2 text-sm font-semibold text-white transition-colors hover:brightness-110 motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </nav>

          <div className="flex shrink-0 items-center md:hidden">
            {!mobileOpen ? (
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-cream motion-safe:transition-transform motion-safe:duration-150 motion-safe:active:scale-90"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
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
              onClick={() => setMobileOpen(false)}
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
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-cream motion-safe:transition-transform motion-safe:duration-150 motion-safe:active:scale-90"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
                {navLinks.map((link, index) => (
                  <m.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.04 + index * 0.04,
                      duration: 0.22,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-base font-medium transition-colors motion-safe:active:scale-[0.98]",
                        pathname === link.href
                          ? "bg-accent-muted text-accent"
                          : "text-muted hover:text-cream"
                      )}
                    >
                      {link.label}
                    </Link>
                  </m.div>
                ))}
                <m.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.04 + navLinks.length * 0.04,
                    duration: 0.22,
                    ease: "easeOut",
                  }}
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-base font-semibold text-white motion-safe:transition-transform motion-safe:duration-150 motion-safe:active:scale-[0.98]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </a>
                </m.div>
              </div>
            </m.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
