"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "@/lib/motion";
import { MenuHeroCarousel } from "@/components/menu/MenuHeroCarousel";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuCategorySectionHeader } from "@/components/menu/MenuCategorySectionHeader";
import { AddToCartModal } from "@/components/menu/AddToCartModal";
import { StaggerGrid } from "@/components/motion/StaggerGrid";
import { categoryCrossFade } from "@/lib/motion-presets";
import {
  groupMenuItemsByCategory,
  sortMenuItems,
} from "@/lib/menu-order";
import type { Category, MenuItem } from "@/types/menu";
import type { MenuBanner } from "@/types/banner";

const LIST_CLASS = "flex flex-col gap-3.5 sm:gap-4";

function MenuItemGrid({
  items,
  onCustomize,
  priorityCount = 0,
}: {
  items: MenuItem[];
  onCustomize: (item: MenuItem) => void;
  priorityCount?: number;
}) {
  return (
    <StaggerGrid className={LIST_CLASS}>
      {items.map((item, index) => (
        <MenuItemCard
          key={item.id}
          item={item}
          stagger
          imagePriority={index < priorityCount}
          onCustomize={onCustomize}
        />
      ))}
    </StaggerGrid>
  );
}

export default function MenuPageClient({
  categories: categoriesProp,
  menuItems: menuItemsProp,
  banners = [],
}: {
  categories: Category[];
  menuItems: MenuItem[];
  banners?: MenuBanner[];
}) {
  const categories = categoriesProp ?? [];
  const menuItems = menuItemsProp ?? [];
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const scrollToCategoryTitle = useCallback(() => {
    requestAnimationFrame(() => {
      titleRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setActiveCategory(categoryId);
      scrollToCategoryTitle();
    },
    [scrollToCategoryTitle]
  );

  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const match = categories.find((c) => c.slug === categorySlug);
      if (match) {
        setActiveCategory(match.id);
        scrollToCategoryTitle();
      }
    }
  }, [searchParams, categories, scrollToCategoryTitle]);

  const filteredItems = useMemo(() => {
    let filtered = menuItems.filter((item) => item.isAvailable);

    if (activeCategory !== "all") {
      filtered = filtered.filter((item) => item.categoryId === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.name ?? "").toLowerCase().includes(q) ||
          (item.description ?? "").toLowerCase().includes(q) ||
          (item.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return sortMenuItems(filtered);
  }, [activeCategory, searchQuery, menuItems]);

  const groupedSections = useMemo(
    () =>
      activeCategory === "all"
        ? groupMenuItemsByCategory(filteredItems, categories)
        : [],
    [activeCategory, filteredItems, categories]
  );

  const showGrouped =
    activeCategory === "all" && groupedSections.length > 0;

  const activeCategoryName =
    activeCategory === "all"
      ? "All Items"
      : categories.find((c) => c.id === activeCategory)?.name;

  const gridKey = `${activeCategory}-${searchQuery.trim().toLowerCase()}`;

  const hasActiveFilters =
    searchQuery.trim() !== "" || activeCategory !== "all";

  return (
    <div className="pb-20">
      {banners.length > 0 ? (
        <section className="border-b border-cream/5 bg-surface-raised/30 py-5 sm:py-6 lg:py-8">
          <MenuHeroCarousel banners={banners} />
        </section>
      ) : null}

      <div
        id="menu-category-nav"
        className="sticky top-[var(--site-header-height)] z-40 border-b border-white/5 bg-ink/[0.98] shadow-sm shadow-black/10"
      >
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResultCount={
              searchQuery.trim() ? filteredItems.length : undefined
            }
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <section>
          {!showGrouped ? (
            <div
              ref={titleRef}
              className="mb-5 scroll-mt-[var(--menu-category-scroll-offset)] sm:mb-6"
            >
              <AnimatePresence mode="wait">
                <m.div
                  key={activeCategoryName ?? "all"}
                  initial={categoryCrossFade.initial}
                  animate={categoryCrossFade.animate}
                  exit={categoryCrossFade.exit}
                  transition={categoryCrossFade.transition}
                >
                  <MenuCategorySectionHeader title={activeCategoryName ?? "All Items"} />
                </m.div>
              </AnimatePresence>
            </div>
          ) : (
            <div ref={titleRef} className="scroll-mt-[var(--menu-category-scroll-offset)]" aria-hidden />
          )}

          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <m.div
                key="empty"
                initial={categoryCrossFade.initial}
                animate={categoryCrossFade.animate}
                exit={categoryCrossFade.exit}
                transition={categoryCrossFade.transition}
                className="rounded-2xl border border-cream/5 bg-surface-raised py-16 text-center"
              >
                <p className="text-cream/50">
                  {hasActiveFilters
                    ? "No items match your search"
                    : "Menu items are not available right now"}
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      handleCategoryChange("all");
                    }}
                    className="mt-4 text-sm font-medium text-accent hover:underline"
                  >
                    Clear filters
                  </button>
                ) : null}
              </m.div>
            ) : showGrouped ? (
              <m.div
                key={gridKey}
                initial={categoryCrossFade.initial}
                animate={categoryCrossFade.animate}
                exit={categoryCrossFade.exit}
                transition={categoryCrossFade.transition}
                className="space-y-8 sm:space-y-10"
              >
                {groupedSections.map(({ category, items }, sectionIndex) => (
                  <div key={category.id} className="space-y-4 sm:space-y-5">
                    <MenuCategorySectionHeader title={category.name} />
                    <MenuItemGrid
                      items={items}
                      onCustomize={setModalItem}
                      priorityCount={sectionIndex === 0 ? 4 : 0}
                    />
                  </div>
                ))}
              </m.div>
            ) : (
              <m.div
                key={gridKey}
                initial={categoryCrossFade.initial}
                animate={categoryCrossFade.animate}
                exit={categoryCrossFade.exit}
                transition={categoryCrossFade.transition}
              >
                <MenuItemGrid
                  items={filteredItems}
                  onCustomize={setModalItem}
                  priorityCount={4}
                />
              </m.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <AddToCartModal item={modalItem} onClose={() => setModalItem(null)} />
    </div>
  );
}
