"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
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

const cardBaseClass =
  "menu-card-optimized menu-product-card group overflow-hidden rounded-xl border bg-surface-raised";

function MenuItemCardComponent({
  item,
  onCustomize,
  compact = false,
  imagePriority = false,
}: MenuItemCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

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

    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 500);
  }, [addItem, item, onCustomize]);

  if (compact) {
    return (
      <article className={`${cardBaseClass} flex gap-3 p-2.5`}>
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
          <div className="mb-1 min-w-0">
            <h3 className="text-sm font-semibold leading-snug text-cream">
              {item.name}
            </h3>
            <p className="mt-0.5 text-sm font-semibold text-accent">
              {formatPrice(item.price)}
            </p>
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
    <motion.article
      animate={
        justAdded ? { scale: [1, 0.97, 1.02, 1] } : { scale: 1 }
      }
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`${cardBaseClass} flex flex-col`}
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
        <div className="mb-1.5 min-w-0">
          <h3
            className="text-[13px] font-semibold leading-[1.35] text-cream sm:text-sm"
            title={item.name}
          >
            {item.name}
          </h3>
          <p className="mt-1 text-sm font-semibold text-accent">
            {formatPrice(item.price)}
          </p>
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
    </motion.article>
  );
}

export const MenuItemCard = memo(MenuItemCardComponent);
