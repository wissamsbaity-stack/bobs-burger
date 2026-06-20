export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  icon: string | null;
}

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
}

export interface MenuItemWithCategory extends MenuItem {
  category: Category;
}
