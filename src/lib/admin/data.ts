import { requireAdmin } from "@/lib/auth/admin";
import type { CategoryRow, MenuItemRow } from "@/lib/supabase/types";

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
  const [categories, items] = await Promise.all([
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("menu_items").select("id", { count: "exact", head: true }),
  ]);
  return {
    categories: categories.count ?? 0,
    menuItems: items.count ?? 0,
  };
}
