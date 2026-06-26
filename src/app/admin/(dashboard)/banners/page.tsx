import { AdminHeader } from "@/components/admin/AdminHeader";
import { HeroBannersManager } from "@/components/admin/HeroBannersManager";
import { getAdminMenuBanners } from "@/lib/admin/data";

export const metadata = {
  title: "Hero Banners",
};

export default async function AdminBannersPage() {
  const { banners, schemaReady, error } = await getAdminMenuBanners();

  return (
    <>
      <AdminHeader
        title="Hero Banners"
        description="Manage the menu page carousel — upload, reorder, and enable banners."
      />
      <HeroBannersManager
        banners={banners}
        schemaReady={schemaReady}
        loadError={error}
      />
    </>
  );
}
