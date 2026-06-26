import { createServerClient } from "@/lib/supabase/server";
import { mapMenuBanner } from "@/lib/supabase/banner-mappers";
import type { MenuBanner } from "@/types/banner";

export async function getMenuBanners(): Promise<MenuBanner[]> {
  const supabase = await createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("menu_banners")
    .select("*")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getMenuBanners]", error);
    return [];
  }

  return (data ?? []).map(mapMenuBanner);
}
