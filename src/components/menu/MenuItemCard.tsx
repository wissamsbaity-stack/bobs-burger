"use client";

import { memo, useCallback } from "react";
import { Plus } from "lucide-react";
import { MenuItemImage } from "@/components/menu/MenuItemImage";
import { MenuItemBadges } from "@/components/menu/MenuItemBadges";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  onCustomize?: (item: MenuItem) => void;
  compact?: boolean;
  imagePriority?: boolean;
}

function MenuItemCardComponent({
  item,
  onCustomize,
  compact = false,
  imagePriority = false,
}: MenuItemCardProps) {
  const { addItem } = useCart();

  const handleAdd = useCallback(() => {
    if (onCustomize) {
      onCustomize(item);
      return;
    }

    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      notes: "",
    });
  }, [addItem, item, onCustomize]);

  if (compact) {
    return (
      <article
        className="menu-card-optimized group flex gap-3 overflow-hidden rounded-xl border border-white/5 bg-surface-raised p-2.5 transition-[border-color,box-shadow] duration-200 hover:border-accent/25 motion-safe:hover:shadow-card"
      >
        <div className="relative shrink-0">
          <MenuItemImage
            src={item.imageUrl}
            alt={item.name}
            compact
            priority={imagePriority}
          />
          <MenuItemBadges item={item} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col py-0.5">
          <div className="mb-0.5 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-cream">
              {item.name}
            </h3>
            <span className="shrink-0 text-sm font-semibold text-accent">
              {formatPrice(item.price)}
            </span>
          </div>
          <p className="mb-2 line-clamp-1 text-xs text-muted">
            {item.description}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="mt-auto w-fit"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article
      className="menu-card-optimized group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-surface-raised transition-[border-color,box-shadow] duration-200 hover:border-accent/25 motion-safe:hover:shadow-card"
    >
      <div className="relative">
        <MenuItemImage
          src={item.imageUrl}
          alt={item.name}
          priority={imagePriority}
        />
        <MenuItemBadges item={item} />
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-cream sm:text-[15px]">
            {item.name}
          </h3>
          <span className="shrink-0 text-sm font-semibold text-accent">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="mb-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
          {item.description}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="mt-auto w-full"
        >
          <Plus className="h-3.5 w-3.5" />
          Add to Cart
        </Button>
      </div>
    </article>
  );
}

export const MenuItemCard = memo(MenuItemCardComponent);
