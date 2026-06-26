import type { Metadata } from "next";
import { Suspense } from "react";
import MenuPageClient from "./MenuPageClient";
import Loading from "./loading";
import { getMenuData } from "@/lib/menu-service";
import { getMenuBanners } from "@/lib/banner-service";
import { getSiteSettings } from "@/lib/settings/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Menu",
    description: `Browse the full ${settings.name} menu — beef, Angus, chicken, sides, and more.`,
  };
}

export default async function Page() {
  const [{ categories, menuItems }, banners] = await Promise.all([
    getMenuData(),
    getMenuBanners(),
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <MenuPageClient
        categories={categories}
        menuItems={menuItems}
        banners={banners}
      />
    </Suspense>
  );
}
