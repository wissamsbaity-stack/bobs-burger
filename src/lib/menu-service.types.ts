import type { Category, MenuItem } from "@/types/menu";

export interface MenuService {
  getCategories(): Promise<Category[]>;
  getMenuItems(): Promise<MenuItem[]>;
  getFeaturedItems(): Promise<MenuItem[]>;
  getPopularItems(): Promise<MenuItem[]>;
  getHighlightedItems(): Promise<MenuItem[]>;
  getItemsByCategory(categoryId: string): Promise<MenuItem[]>;
  searchItems(query: string): Promise<MenuItem[]>;
  getItemBySlug(slug: string): Promise<MenuItem | null>;
}
