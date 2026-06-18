"use client";

import { CategoryIcon } from "@/components/menu/CategoryIcon";
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
        "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
        className
      )}
    >
      <button
        type="button"
        onClick={() => onCategoryChange("all")}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all min-h-11",
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
            "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all min-h-11",
            activeCategory === category.id
              ? "bg-accent text-white shadow-ember"
              : "bg-white/5 text-muted hover:bg-white/10 hover:text-cream"
          )}
        >
          <CategoryIcon
            icon={category.icon}
            size={16}
            className={
              activeCategory === category.id
                ? "text-white"
                : "text-muted group-hover:text-cream"
            }
          />
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}
