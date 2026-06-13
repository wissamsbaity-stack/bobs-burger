import type { Category, MenuItem } from "@/types/menu";
import type { CategoryRow, MenuItemRow } from "@/lib/supabase/types";

const PLACEHOLDER_IMAGE =
  "https://s3.eu-central-1.amazonaws.com/act.omegapos.com/OmegaCloud/57069/omenu/2.jpg";

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    sortOrder: row.sort_order,
  };
}

export function mapMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: Number(row.price),
    categoryId: row.category_id,
    imageUrl: row.image_url ?? PLACEHOLDER_IMAGE,
    isFeatured: row.is_featured,
    isPopular: row.is_popular,
    isAvailable: row.is_available,
    tags: row.tags ?? [],
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
