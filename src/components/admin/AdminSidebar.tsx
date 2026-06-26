"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  UtensilsCrossed,
  Settings,
  LogOut,
  ExternalLink,
  Images,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminBrandMark } from "@/components/admin/AdminBrandMark";
import { signOut } from "@/app/admin/(dashboard)/actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/admin/banners", label: "Hero Banners", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const navLinkClass =
  "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors";

export function AdminSidebar({
  email,
  restaurantName,
  logoUrl,
  onNavigate,
}: {
  email: string;
  restaurantName: string;
  logoUrl: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-surface-raised">
      <div className="border-b border-white/10 px-5 py-5 lg:py-6">
        <AdminBrandMark
          restaurantName={restaurantName}
          logoUrl={logoUrl}
          layout="inline"
        />
        <p className="mt-3 truncate text-xs text-muted">{email}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                navLinkClass,
                active
                  ? "bg-accent/15 text-accent"
                  : "text-cream/70 hover:bg-white/5 hover:text-cream"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className={cn(navLinkClass, "text-cream/70 hover:bg-white/5 hover:text-cream")}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View site
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className={cn(
              navLinkClass,
              "w-full text-red-400 hover:bg-red-500/10"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
