"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MapPin,
  MessageCircle,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, m } from "@/lib/motion";
import { RestaurantBrand } from "@/components/layout/RestaurantBrand";
import { useSettings } from "@/contexts/SettingsContext";
import { getGoogleMapsUrl } from "@/lib/settings/helpers";
import { drawerSpring, overlayFade } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

type NavItem =
  | {
      id: string;
      label: string;
      icon: LucideIcon;
      href: string;
      external?: false;
    }
  | {
      id: string;
      label: string;
      icon: LucideIcon;
      href: string;
      external: true;
    };

const navItems: Omit<NavItem, "href">[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "contact", label: "Contact", icon: MessageCircle },
  { id: "location", label: "Location", icon: MapPin },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavRow({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const rowClass = cn(
    "group flex w-full items-center gap-4 rounded-2xl px-3 py-3.5 text-left transition-all duration-200 motion-safe:active:scale-[0.98]",
    active
      ? "bg-accent/12 text-accent shadow-[inset_0_0_0_1px_rgba(255,92,0,0.22)]"
      : "text-cream/80 hover:bg-white/[0.04] hover:text-cream"
  );

  const iconWrapClass = cn(
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
    active
      ? "bg-accent/20 text-accent"
      : "bg-white/[0.05] text-cream/60 group-hover:bg-white/[0.08] group-hover:text-cream"
  );

  const content = (
    <>
      <span className={iconWrapClass}>
        <item.icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
      </span>
      <span className="text-base font-semibold tracking-tight">{item.label}</span>
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={rowClass}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onNavigate} className={rowClass}>
      {content}
    </Link>
  );
}

export function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const settings = useSettings();
  const mapsUrl = getGoogleMapsUrl(settings);

  const items: NavItem[] = [
    { ...navItems[0], href: "/" },
    { ...navItems[1], href: "/menu" },
    { ...navItems[2], href: "/contact" },
    { ...navItems[3], href: mapsUrl, external: true },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <>
          <m.button
            type="button"
            aria-label="Close menu"
            key="nav-backdrop"
            initial={overlayFade.initial}
            animate={overlayFade.animate}
            exit={overlayFade.exit}
            transition={overlayFade.transition}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm md:hidden"
          />
          <m.aside
            key="nav-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={drawerSpring}
            className="fixed bottom-0 left-0 top-0 z-50 flex w-[min(100%,20rem)] flex-col border-r border-white/5 bg-ink shadow-2xl shadow-black/50 md:hidden"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_0%,rgba(255,92,0,0.08)_0%,transparent_70%)]"
              aria-hidden
            />

            <div className="relative flex items-center justify-between border-b border-white/5 px-5 py-4">
              <RestaurantBrand asLink={false} className="min-w-0" />
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-white/5 hover:text-cream motion-safe:active:scale-90"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              aria-label="Mobile navigation"
              className="relative flex flex-1 flex-col justify-center gap-3 px-4 py-8"
            >
              {items.map((item, index) => (
                <m.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.05 + index * 0.05,
                    duration: 0.28,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <NavRow
                    item={item}
                    active={!item.external && isActivePath(pathname, item.href)}
                    onNavigate={onClose}
                  />
                </m.div>
              ))}
            </nav>

            <div className="relative border-t border-white/5 px-5 py-4">
              <p className="text-center text-xs text-cream/35">
                {settings.name}
              </p>
            </div>
          </m.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
