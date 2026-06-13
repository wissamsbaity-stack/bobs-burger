import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { getSiteSettingsRow } from "@/lib/settings/site-settings";

export const metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsRow();

  return (
    <>
      <AdminHeader
        title="Website settings"
        description="WhatsApp number, opening hours, branding, and delivery options."
      />
      <SettingsManager settings={settings} />
    </>
  );
}
