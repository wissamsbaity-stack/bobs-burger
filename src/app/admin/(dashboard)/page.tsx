import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAdminStats } from "@/lib/admin/data";
import { FolderOpen, UtensilsCrossed, Settings, ShoppingBag } from "lucide-react";

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
      label: "Orders",
      value: stats.orders,
      href: "/admin",
      icon: ShoppingBag,
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-white/10 bg-surface-raised p-5 transition-colors hover:border-accent/30"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <p className="text-2xl font-semibold text-cream">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
