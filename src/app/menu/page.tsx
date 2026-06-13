import { Suspense } from "react";
import MenuPageClient from "./MenuPageClient";
import Loading from "./loading";
import { getMenuData } from "@/lib/menu-service";

export const metadata = {
  title: "Menu",
  description: "Browse the full Bob's Burger menu — beef, Angus, chicken, sides, and more.",
};

export default async function Page() {
  const { categories, menuItems } = await getMenuData();

  return (
    <Suspense fallback={<Loading />}>
      <MenuPageClient categories={categories} menuItems={menuItems} />
    </Suspense>
  );
}
