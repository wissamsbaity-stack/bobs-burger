import { CategoriesPreview } from "@/components/home/CategoriesPreview";
import { OrderCTA } from "@/components/home/OrderCTA";
import { Hero } from "@/components/home/Hero";
import { HomePageClientEffects } from "@/components/home/HomePageClientEffects";
import { menuService } from "@/lib/menu-service";

export default async function HomePage() {
  const categories = await menuService.getCategories();

  return (
    <>
      <HomePageClientEffects />
      <Hero />
      <CategoriesPreview categories={categories} />
      <OrderCTA />
    </>
  );
}
