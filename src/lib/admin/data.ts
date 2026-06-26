import { requireAdmin } from "@/lib/auth/admin";
import { isMissingRelationError } from "@/lib/supabase/errors";
import type { CategoryRow, Database, MenuItemRow } from "@/lib/supabase/types";

type MenuBannerRow = Database["public"]["Tables"]["menu_banners"]["Row"];

export type AdminMenuBannersResult = {
  banners: MenuBannerRow[];
  /** False when the menu_banners table has not been migrated yet. */
  schemaReady: boolean;
  error: string | null;
};

export async function getAdminMenuBanners(): Promise<AdminMenuBannersResult> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("menu_banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getAdminMenuBanners]", error.message, error.code);

    if (isMissingRelationError(error)) {
      return {
        banners: [],
        schemaReady: false,
        error:
          "The menu_banners table does not exist yet. Run migration 010_menu_banners.sql in the Supabase SQL Editor.",
      };
    }

    return {
      banners: [],
      schemaReady: true,
      error: error.message,
    };
  }

  return {
    banners: data ?? [],
    schemaReady: true,
    error: null,
  };
}

export async function getAdminCategories(): Promise<CategoryRow[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAdminMenuItems(): Promise<MenuItemRow[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminStats() {
  const { supabase } = await requireAdmin();
  const [categories, items, bannerCount] = await Promise.all([
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("menu_items").select("id", { count: "exact", head: true }),
    supabase.from("menu_banners").select("id", { count: "exact", head: true }),
  ]);
  return {
    categories: categories.count ?? 0,
    menuItems: items.count ?? 0,
    banners: bannerCount.error ? 0 : (bannerCount.count ?? 0),
  };
}
