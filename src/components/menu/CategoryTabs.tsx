"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types/menu";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: CategoryTabsProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-2 scrollbar-none",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onCategoryChange("all")}
        className={cn(
          "shrink-0 rounded-full px-5 py-3 text-sm font-medium transition-all min-h-11",
          activeCategory === "all"
            ? "bg-accent text-white shadow-ember"
            : "bg-white/5 text-muted hover:bg-white/10 hover:text-cream"
        )}
      >
        All Items
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "shrink-0 rounded-full px-5 py-3 text-sm font-medium transition-all min-h-11",
            activeCategory === category.id
              ? "bg-accent text-white shadow-ember"
              : "bg-white/5 text-muted hover:bg-white/10 hover:text-cream"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
