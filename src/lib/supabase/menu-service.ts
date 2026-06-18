import { createServerClient } from "@/lib/supabase/server";
import { mapCategory, mapMenuItem } from "@/lib/supabase/mappers";
import type { Category, MenuItem } from "@/types/menu";
import type { MenuService } from "@/lib/menu-service.types";
import { categories as staticCategories, menuItems as staticMenuItems } from "@/data/menu";

const BURGER_CATEGORIES = new Set([
  "cat-beef-burgers",
  "cat-chicken-burgers",
]);

const PLACEHOLDER =
  "https://s3.eu-central-1.amazonaws.com/act.omegapos.com/OmegaCloud/57069/omenu/2.jpg";

function hasRealImage(item: MenuItem): boolean {
  return Boolean(item.imageUrl && item.imageUrl !== PLACEHOLDER);
}

class SupabaseMenuService implements MenuService {
  private async client() {
    const supabase = await createServerClient();
    if (!supabase) throw new Error("Supabase not configured");
    return supabase;
  }

  async getCategories(): Promise<Category[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapCategory);
  }

  async getMenuItems(): Promise<MenuItem[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("name");
    if (error) throw error;
    return (data ?? []).map(mapMenuItem);
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("name");
    if (error) throw error;
    return (data ?? []).map(mapMenuItem);
  }

  async getFeaturedItems(): Promise<MenuItem[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_featured", true)
      .eq("is_available", true);
    if (error) throw error;
    return (data ?? []).map(mapMenuItem);
  }

  async getPopularItems(): Promise<MenuItem[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_popular", true)
      .eq("is_available", true);
    if (error) throw error;
    return (data ?? []).map(mapMenuItem);
  }

  async getHighlightedItems(): Promise<MenuItem[]> {
    const items = await this.getMenuItems();
    return items
      .filter(
        (item) => BURGER_CATEGORIES.has(item.categoryId) && hasRealImage(item)
      )
      .slice(0, 6);
  }

  async getItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_available", true);
    if (error) throw error;
    return (data ?? []).map(mapMenuItem);
  }

  async searchItems(query: string): Promise<MenuItem[]> {
    const items = await this.getMenuItems();
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  async getItemBySlug(slug: string): Promise<MenuItem | null> {
    const supabase = await this.client();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapMenuItem(data) : null;
  }
}

class StaticMenuService implements MenuService {
  async getCategories(): Promise<Category[]> {
    return [...staticCategories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return staticMenuItems.filter((item) => item.isAvailable);
  }

  async getFeaturedItems(): Promise<MenuItem[]> {
    return staticMenuItems.filter((item) => item.isFeatured && item.isAvailable);
  }

  async getPopularItems(): Promise<MenuItem[]> {
    return staticMenuItems.filter((item) => item.isPopular && item.isAvailable);
  }

  async getHighlightedItems(): Promise<MenuItem[]> {
    return staticMenuItems
      .filter(
        (item) =>
          item.isAvailable &&
          BURGER_CATEGORIES.has(item.categoryId) &&
          hasRealImage(item)
      )
      .slice(0, 6);
  }

  async getItemsByCategory(categoryId: string): Promise<MenuItem[]> {
    return staticMenuItems.filter(
      (item) => item.categoryId === categoryId && item.isAvailable
    );
  }

  async searchItems(query: string): Promise<MenuItem[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return this.getMenuItems();
    return staticMenuItems.filter(
      (item) =>
        item.isAvailable &&
        (item.name.toLowerCase().includes(normalized) ||
          item.description.toLowerCase().includes(normalized) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalized)))
    );
  }

  async getItemBySlug(slug: string): Promise<MenuItem | null> {
    return staticMenuItems.find((item) => item.slug === slug) ?? null;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const menuService: MenuService = isSupabaseConfigured()
  ? new SupabaseMenuService()
  : new StaticMenuService();

export async function getMenuData() {
  const [categories, menuItems] = await Promise.all([
    menuService.getCategories(),
    menuService.getMenuItems(),
  ]);
  return { categories, menuItems };
}
