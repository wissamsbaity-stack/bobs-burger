import type { Metadata } from "next";
import { CategoriesPreview } from "@/components/home/CategoriesPreview";
import { OrderCTA } from "@/components/home/OrderCTA";
import { Hero } from "@/components/home/Hero";
import { menuService } from "@/lib/menu-service";

export default async function HomePage() {
  const categories = await menuService.getCategories();

  return (
    <>
      <Hero />
      <CategoriesPreview categories={categories} />
      <OrderCTA />
    </>
  );
}
