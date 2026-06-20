import type { Category, MenuItem } from "@/types/menu";

/** Compare two menu items: displayOrder first, then name A→Z. */
export function compareMenuItems(a: MenuItem, b: MenuItem): number {
  const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  if (orderDiff !== 0) return orderDiff;
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

export function sortMenuItems(items: MenuItem[]): MenuItem[] {
  return [...items].sort(compareMenuItems);
}

export function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Group items under their category in category sortOrder (Appetizers → Beverages). */
export function groupMenuItemsByCategory(
  items: MenuItem[],
  categories: Category[]
): { category: Category; items: MenuItem[] }[] {
  const sorted = sortMenuItems(items);

  return sortCategories(categories)
    .map((category) => ({
      category,
      items: sorted.filter((item) => item.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0);
}
