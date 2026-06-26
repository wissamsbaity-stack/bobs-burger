import type { MenuBanner } from "@/types/banner";
import type { Database } from "@/lib/supabase/types";
import { parseCrop } from "@/lib/image-crop";

type MenuBannerRow = Database["public"]["Tables"]["menu_banners"]["Row"];

export function mapMenuBanner(row: MenuBannerRow): MenuBanner {
  return {
    id: row.id,
    imageUrl: row.image_url,
    imageCrop: parseCrop(row.image_crop),
    title: row.title,
    subtitle: row.subtitle,
    ctaText: row.cta_text,
    ctaLink: row.cta_link,
    sortOrder: row.sort_order,
    isEnabled: row.is_enabled,
  };
}
