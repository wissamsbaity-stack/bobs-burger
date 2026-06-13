import { Hero } from "@/components/home/Hero";
import { CategoriesPreview } from "@/components/home/CategoriesPreview";
import { BurgerHighlights } from "@/components/home/BurgerHighlights";
import { OrderCTA } from "@/components/home/OrderCTA";
import { menuService } from "@/lib/menu-service";

export default async function HomePage() {
  const [categories, highlights, menuItems] = await Promise.all([
    menuService.getCategories(),
    menuService.getHighlightedItems(),
    menuService.getMenuItems(),
  ]);

  return (
    <>
      <Hero menuItemCount={menuItems.length} />
      <CategoriesPreview categories={categories} />
      <BurgerHighlights items={highlights} />
      <OrderCTA />
    </>
  );
}
