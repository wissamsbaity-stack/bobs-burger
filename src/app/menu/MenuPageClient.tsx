"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { AddToCartModal } from "@/components/menu/AddToCartModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Category, MenuItem } from "@/types/menu";

export default function MenuPageClient({
  categories,
  menuItems,
}: {
  categories: Category[];
  menuItems: MenuItem[];
}) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [activeCategory, searchQuery, menuItems]);

  const activeCategoryName =
    activeCategory === "all"
      ? "All Items"
      : categories.find((c) => c.id === activeCategory)?.name;

  return (
    <div className="pb-20">
      <section className="border-b border-cream/5 bg-surface-raised/30 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Menu"
            title="Crafted to perfection"
            description="Search, browse by category, and add your favorites to cart."
            align="center"
            className="mb-8"
          />
          <MenuSearch
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={searchQuery ? filteredItems.length : undefined}
            className="mx-auto max-w-xl"
          />
        </div>
      </section>

      <div
        id="menu-category-nav"
        className="sticky top-[var(--site-header-height)] z-40 border-b border-white/5 bg-ink/[0.98] shadow-sm shadow-black/10"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <section>
          <h2
            ref={titleRef}
            className="scroll-mt-[var(--menu-category-scroll-offset)] mb-4 text-lg font-semibold text-cream sm:mb-5 sm:text-xl"
          >
            {activeCategoryName}
          </h2>

          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-cream/5 bg-surface-raised py-16 text-center">
              <p className="text-cream/50">No items match your search</p>
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
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredItems.map((item, index) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  imagePriority={index < 4}
                  onCustomize={setModalItem}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {modalItem ? (
        <AddToCartModal item={modalItem} onClose={() => setModalItem(null)} />
      ) : null}
    </div>
  );
}
