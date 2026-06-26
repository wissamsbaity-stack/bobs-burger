"use client";

import { CategoryIcon } from "@/components/menu/CategoryIcon";
import { MenuExpandableSearch } from "@/components/menu/MenuExpandableSearch";
import { m, LayoutGroup } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/menu";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchResultCount?: number;
  className?: string;
}

const tabPillSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.85,
};

function CategoryTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium min-h-11 motion-safe:active:scale-[0.97]",
        active ? "text-white" : "bg-white/5 text-muted hover:bg-white/10 hover:text-cream"
      )}
    >
      {active ? (
        <m.span
          layoutId="category-tab-pill"
          className="absolute inset-0 rounded-full bg-accent shadow-ember"
          transition={tabPillSpring}
        />
      ) : null}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </m.button>
  );
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  searchResultCount,
  className,
}: CategoryTabsProps) {
  const showSearch =
    searchQuery !== undefined && onSearchChange !== undefined;

  return (
    <LayoutGroup id="menu-category-tabs">
      <div
        className={cn(
          "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
          className
        )}
      >
        <CategoryTab
          active={activeCategory === "all"}
          onClick={() => onCategoryChange("all")}
        >
          All Items
        </CategoryTab>

        {showSearch ? (
          <MenuExpandableSearch
            value={searchQuery}
            onChange={onSearchChange}
            resultCount={searchResultCount}
          />
        ) : null}

        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => onCategoryChange(category.id)}
          >
            <CategoryIcon
              icon={category.icon}
              size={16}
              className={activeCategory === category.id ? "text-white" : "text-muted"}
            />
            <span>{category.name}</span>
          </CategoryTab>
        ))}
      </div>
    </LayoutGroup>
  );
}
