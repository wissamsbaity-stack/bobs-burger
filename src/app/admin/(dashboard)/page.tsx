import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAdminStats } from "@/lib/admin/data";
import { FolderOpen, UtensilsCrossed, Settings } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    {
      label: "Categories",
      value: stats.categories,
      href: "/admin/categories",
      icon: FolderOpen,
    },
    {
      label: "Menu items",
      value: stats.menuItems,
      href: "/admin/menu",
      icon: UtensilsCrossed,
    },
    {
      label: "Settings",
      value: "—",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Manage your restaurant menu, settings, and content."
      />
      <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-3">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-white/10 bg-surface-raised p-6 transition-colors hover:border-accent/30 motion-safe:hover:scale-[1.01]"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-semibold text-cream">{value}</p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
