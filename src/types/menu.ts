export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
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
}

export interface MenuItemWithCategory extends MenuItem {
  category: Category;
}
