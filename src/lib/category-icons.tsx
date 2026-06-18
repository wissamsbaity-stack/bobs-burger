import type { LucideIcon } from "lucide-react";
import {
  Beef,
  Coffee,
  Cookie,
  CupSoda,
  Droplet,
  Drumstick,
  Flame,
  Fish,
  Sandwich,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

export const DEFAULT_CATEGORY_ICON = "utensils";

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  cookie: Cookie,
  beef: Beef,
  flame: Flame,
  drumstick: Drumstick,
  "cup-soda": CupSoda,
  droplet: Droplet,
  sandwich: Sandwich,
  utensils: UtensilsCrossed,
  wine: Wine,
  coffee: Coffee,
  fish: Fish,
};

export const CATEGORY_ICON_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "cookie", label: "Cookie / Snacks" },
  { id: "beef", label: "Burger / Beef" },
  { id: "flame", label: "Flame / Spicy" },
  { id: "drumstick", label: "Chicken" },
  { id: "cup-soda", label: "Cup / Drink" },
  { id: "droplet", label: "Sauce / Drip" },
  { id: "sandwich", label: "Sandwich / Wrap" },
  { id: "fish", label: "Fish / Seafood" },
  { id: "wine", label: "Wine / Bar" },
  { id: "coffee", label: "Coffee / Hot" },
  { id: "utensils", label: "General / Default" },
];

export function resolveCategoryIconKey(icon?: string | null): string {
  if (icon && CATEGORY_ICON_MAP[icon]) return icon;
  return DEFAULT_CATEGORY_ICON;
}
