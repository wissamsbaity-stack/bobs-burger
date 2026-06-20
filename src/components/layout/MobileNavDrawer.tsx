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
import { useSettings } from "@/contexts/SettingsContext";
import { getGoogleMapsUrl } from "@/lib/settings/helpers";
import { drawerSpring, overlayFade } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  external?: boolean;
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

const rowClass =
  "flex w-full items-center gap-3 px-5 py-3.5 text-[15px] font-medium transition-colors duration-150 motion-safe:active:opacity-70";

function NavRow({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const className = cn(
    rowClass,
    active ? "text-accent" : "text-cream/75 hover:text-cream"
  );

  const content = (
    <>
      <item.icon
        className={cn("h-[18px] w-[18px] shrink-0", active ? "text-accent" : "text-cream/50")}
        strokeWidth={1.75}
      />
      <span>{item.label}</span>
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
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
    <Link href={item.href} onClick={onNavigate} className={className}>
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
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />
          <m.aside
            key="nav-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={drawerSpring}
            className="fixed bottom-0 left-0 top-0 z-50 flex w-[min(100%,17rem)] flex-col border-r border-white/[0.06] bg-ink md:hidden"
          >
            <div className="flex items-center justify-end px-3 py-3">
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-cream/50 transition-colors hover:text-cream motion-safe:active:opacity-70"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="flex flex-col py-1">
              {items.map((item) => (
                <NavRow
                  key={item.id}
                  item={item}
                  active={!item.external && isActivePath(pathname, item.href)}
                  onNavigate={onClose}
                />
              ))}
            </nav>
          </m.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
