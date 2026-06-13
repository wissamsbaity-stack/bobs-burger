import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-ink text-cream">
      <AdminSidebar email={profile.email} />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
