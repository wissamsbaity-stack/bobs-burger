import type { Category, MenuItem } from "@/types/menu";
import extracted from "./menu-extracted.json";

const PLACEHOLDER_IMAGE =
  "https://s3.eu-central-1.amazonaws.com/act.omegapos.com/OmegaCloud/57069/omenu/2.jpg";

export const DELIVERY_FEE = 0;

const categoryMeta: Record<string, { name: string; description: string }> = {
  "cat-sides": {
    name: "Sides",
    description: "Crispy fries, wings, tenders and golden sides",
  },
  "cat-baked-potato": {
    name: "Baked Potato",
    description: "Oven-baked loaded potatoes",
  },
  "cat-wraps-and-subs": {
    name: "Wraps & Subs",
    description: "Wraps and Lebanese-style subs",
  },
  "cat-beef-burger": {
    name: "Beef Burgers",
    description: "Char-grilled beef burgers",
  },
  "cat-angus-burgers": {
    name: "Angus Burgers",
    description: "Premium black Angus patties",
  },
  "cat-chicken-burger": {
    name: "Chicken Burgers",
    description: "Grilled and crispy chicken burgers",
  },
  "cat-upgrade": {
    name: "Upgrades",
    description: "Make it a combo meal",
  },
  "cat-soft-drink": {
    name: "Beverages",
    description: "Soft drinks and refreshments",
  },
  "cat-add-on-s": {
    name: "Add-Ons",
    description: "Sauces, dips and extras",
  },
  "cat-value-meals": {
    name: "Value Meals",
    description: "Special offers and promos",
  },
};

export const categories: Category[] = extracted.categories
  .map((cat) => ({
    id: cat.id,
    name: categoryMeta[cat.id]?.name ?? cat.name,
    slug: cat.slug,
    description: categoryMeta[cat.id]?.description ?? cat.description,
    sortOrder: cat.sortOrder,
  }))
  .sort((a, b) => a.sortOrder - b.sortOrder);

export const menuItems: MenuItem[] = extracted.menuItems.map((item) => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  description: item.description,
  price: item.price,
  categoryId: item.categoryId,
  imageUrl: item.imageUrl ?? PLACEHOLDER_IMAGE,
  isFeatured: item.isFeatured,
  isPopular: item.isPopular,
  isAvailable: item.isAvailable,
  tags: item.tags,
}));

export const menuStats = extracted.stats;
export { extracted as menuExtracted };
