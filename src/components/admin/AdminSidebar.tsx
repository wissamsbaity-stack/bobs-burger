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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/admin/(dashboard)/actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-surface-raised">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="font-display text-2xl tracking-wide text-accent">
          BOB&apos;S ADMIN
        </p>
        <p className="mt-1 truncate text-xs text-muted">{email}</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent/15 text-accent"
                  : "text-cream/70 hover:bg-white/5 hover:text-cream"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/70 hover:bg-white/5 hover:text-cream"
        >
          <ExternalLink className="h-4 w-4" />
          View site
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
