"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import { MenuSearch } from "@/components/menu/MenuSearch";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { AddToCartModal } from "@/components/menu/AddToCartModal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Category, MenuItem } from "@/types/menu";

const BURGER_CATS = new Set([
  "cat-beef-burger",
  "cat-angus-burgers",
  "cat-chicken-burger",
]);
const PLACEHOLDER =
  "https://s3.eu-central-1.amazonaws.com/act.omegapos.com/OmegaCloud/57069/omenu/2.jpg";

function hasRealImage(item: MenuItem) {
  return item.imageUrl && item.imageUrl !== PLACEHOLDER;
}

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
  const itemsSectionRef = useRef<HTMLElement>(null);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    requestAnimationFrame(() => {
      itemsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

  useEffect(() => {
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const match = categories.find((c) => c.slug === categorySlug);
      if (match) setActiveCategory(match.id);
    }
  }, [searchParams, categories]);

  const filterItems = useCallback(
    (items: MenuItem[]) => {
      let filtered = items.filter((item) => item.isAvailable);

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
    },
    [activeCategory, searchQuery]
  );

  const highlightedItems = useMemo(
    () =>
      filterItems(
        menuItems.filter(
          (item) => BURGER_CATS.has(item.categoryId) && hasRealImage(item)
        )
      ).slice(0, 6),
    [filterItems]
  );

  const highlightIds = useMemo(
    () => new Set(highlightedItems.map((item) => item.id)),
    [highlightedItems]
  );

  const allFilteredItems = useMemo(() => {
    const filtered = filterItems(menuItems);
    const showSections = !searchQuery && activeCategory === "all";
    if (!showSections || highlightIds.size === 0) return filtered;
    return filtered.filter((item) => !highlightIds.has(item.id));
  }, [filterItems, highlightIds, searchQuery, activeCategory]);

  const showSections = !searchQuery && activeCategory === "all";
  const totalVisible =
    allFilteredItems.length + (showSections ? highlightedItems.length : 0);

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
            resultCount={searchQuery ? totalVisible : undefined}
            className="mx-auto max-w-xl"
          />
        </div>
      </section>

      <div className="sticky top-[72px] z-40 border-b border-white/5 bg-ink/[0.98]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {showSections && highlightedItems.length > 0 ? (
          <section className="mb-14">
            <div className="mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold text-cream">
                Burger highlights
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlightedItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  highlighted
                  imagePriority
                  onCustomize={setModalItem}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section
          ref={itemsSectionRef}
          className="scroll-mt-[8.75rem]"
        >
          <h2 className="mb-6 text-xl font-semibold text-cream">
            {activeCategory === "all"
              ? "All Items"
              : categories.find((c) => c.id === activeCategory)?.name}
          </h2>

          {totalVisible === 0 ? (
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allFilteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
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
