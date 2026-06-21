export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  icon: string | null;
}

import type { ImageCrop } from "@/lib/image-crop";

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  isPopular: boolean;
  isBestSeller: boolean;
  isAvailable: boolean;
  tags: string[];
  /** Lower numbers appear first within a category; ties break alphabetically. */
  displayOrder: number;
  /** Non-destructive crop framing for the image; null = show full image. */
  imageCrop: ImageCrop | null;
}

export interface MenuItemWithCategory extends MenuItem {
  category: Category;
}
