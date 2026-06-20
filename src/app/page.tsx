import { CategoriesPreview } from "@/components/home/CategoriesPreview";
import { OrderCTA } from "@/components/home/OrderCTA";
import { Hero } from "@/components/home/Hero";
import { HomeScrollRestore } from "@/components/home/HomeScrollRestore";
import { menuService } from "@/lib/menu-service";

export default async function HomePage() {
  const categories = await menuService.getCategories();

  return (
    <>
      <HomeScrollRestore />
      <Hero />
      <CategoriesPreview categories={categories} />
      <OrderCTA />
    </>
  );
}
