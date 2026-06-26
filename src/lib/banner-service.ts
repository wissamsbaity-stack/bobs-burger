import { createServerClient } from "@/lib/supabase/server";
import { mapMenuBanner } from "@/lib/supabase/banner-mappers";
import { isMissingRelationError } from "@/lib/supabase/errors";
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
    if (isMissingRelationError(error)) {
      console.error(
        "[getMenuBanners] menu_banners table missing — run migration 010_menu_banners.sql"
      );
    } else {
      console.error("[getMenuBanners]", error.message, error.code);
    }
    return [];
  }

  return (data ?? []).map(mapMenuBanner);
}
