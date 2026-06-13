"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Logo({ logoUrl }: { logoUrl: string }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={logoUrl}
          alt="Bob's Burger"
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div className="leading-none">
        <span className="block font-display text-lg font-bold tracking-wide text-accent">
          BOB&apos;S
        </span>
        <span className="block font-display text-lg font-bold tracking-wide text-cream">
          BURGER
        </span>
      </div>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const settings = useSettings();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo logoUrl={settings.branding.logo} />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-accent-muted text-accent"
                  : "text-muted hover:text-cream"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            className="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:flex"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {itemCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-xs">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    pathname === link.href
                      ? "bg-accent-muted text-accent"
                      : "text-muted hover:text-cream"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openCart();
                }}
                className="flex w-full items-center gap-2 rounded-xl bg-accent px-4 py-3 text-base font-semibold text-white"
              >
                <ShoppingBag className="h-5 w-5" />
                Cart {itemCount > 0 ? `(${itemCount})` : ""}
              </button>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
