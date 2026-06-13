"use client";

import { memo, useCallback } from "react";
import { Plus } from "lucide-react";
import { MenuItemImage } from "@/components/menu/MenuItemImage";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  onCustomize?: (item: MenuItem) => void;
  compact?: boolean;
  highlighted?: boolean;
  imagePriority?: boolean;
}

function MenuItemCardComponent({
  item,
  onCustomize,
  compact = false,
  highlighted = false,
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

  return (
    <article
      className={cn(
        "menu-card-optimized group flex overflow-hidden rounded-2xl border bg-surface-raised transition-[border-color,box-shadow] duration-200",
        highlighted
          ? "border-accent/30 shadow-ember hover:border-accent/50"
          : "border-white/5 hover:border-accent/25 motion-safe:hover:shadow-card",
        compact ? "gap-4 p-3" : "flex-col"
      )}
    >
      <MenuItemImage
        src={item.imageUrl}
        alt={item.name}
        compact={compact}
        priority={imagePriority}
      />

      <div className={cn("flex flex-1 flex-col", compact ? "py-1" : "p-5")}>
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3
            className={cn(
              "font-semibold text-cream",
              compact ? "text-base" : "text-lg"
            )}
          >
            {item.name}
          </h3>
          <span className="shrink-0 font-semibold text-accent">
            {formatPrice(item.price)}
          </span>
        </div>

        {!compact ? (
          <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted">
            {item.description}
          </p>
        ) : (
          <p className="mb-2 line-clamp-1 text-xs text-muted">
            {item.description}
          </p>
        )}

        <Button
          variant="outline"
          size={compact ? "sm" : "md"}
          onClick={handleAdd}
          className={cn("mt-auto", compact && "w-fit")}
        >
          <Plus className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </article>
  );
}

export const MenuItemCard = memo(MenuItemCardComponent);
