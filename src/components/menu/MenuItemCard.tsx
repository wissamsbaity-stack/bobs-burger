"use client";

import { memo, useCallback, useState } from "react";
import type { Transition } from "framer-motion";
import { m, useReducedMotion } from "@/lib/motion";
import { Plus } from "lucide-react";
import { MenuItemImage } from "@/components/menu/MenuItemImage";
import { MenuItemBadges } from "@/components/menu/MenuItemBadges";
import { AddToCartButton } from "@/components/menu/AddToCartButton";
import { useCart } from "@/contexts/CartContext";
import {
  cardReveal,
  revealStagger,
  staggerItemVariants,
} from "@/lib/motion-presets";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  onCustomize?: (item: MenuItem) => void;
  compact?: boolean;
  imagePriority?: boolean;
  revealIndex?: number;
  /** Use parent StaggerGrid stagger instead of individual whileInView */
  stagger?: boolean;
}

const cardBaseClass =
  "menu-card-optimized menu-product-card group overflow-hidden rounded-xl border bg-surface-raised";

function MenuItemCardComponent({
  item,
  onCustomize,
  compact = false,
  imagePriority = false,
  revealIndex = 0,
  stagger = false,
}: MenuItemCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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
    window.setTimeout(() => setJustAdded(false), 600);
  }, [addItem, item, onCustomize]);

  const revealProps = prefersReducedMotion
    ? {}
    : stagger
      ? { variants: staggerItemVariants }
      : {
          initial: cardReveal.initial,
          whileInView: cardReveal.whileInView,
          viewport: cardReveal.viewport,
          transition: revealStagger(revealIndex),
        };

  const pulseTransition: Transition | undefined = justAdded
    ? { duration: 0.35, ease: "easeOut" }
    : stagger
      ? undefined
      : revealStagger(revealIndex);

  if (compact) {
    return (
      <m.article
        {...revealProps}
        animate={justAdded ? { scale: [1, 0.97, 1.02, 1] } : undefined}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
        transition={pulseTransition}
        className={`${cardBaseClass} flex gap-3 p-2.5`}
      >
        <div className="relative shrink-0">
          <MenuItemImage
            src={item.imageUrl}
            alt={item.name}
            compact
            priority={imagePriority}
            crop={item.imageCrop}
          />
          <MenuItemBadges item={item} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col py-0.5">
          <div className="mb-1 min-w-0">
            <h3 className="text-sm font-semibold leading-snug text-cream">
              {item.name}
            </h3>
            <p className="mt-0.5 text-base font-bold text-accent">
              {formatPrice(item.price)}
            </p>
          </div>
          <p className="mb-2 line-clamp-1 text-xs text-muted">
            {item.description}
          </p>
          <AddToCartButton
            onAdd={handleAdd}
            confirm={!onCustomize}
            idleIcon={<Plus className="h-3.5 w-3.5" />}
            idleLabel="Add"
            className="mt-auto"
          />
        </div>
      </m.article>
    );
  }

  return (
    <m.article
      {...revealProps}
      animate={
        justAdded && !prefersReducedMotion
          ? { scale: [1, 0.97, 1.02, 1] }
          : undefined
      }
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      transition={pulseTransition}
      className={`${cardBaseClass} flex flex-col`}
    >
      <div className="relative">
        <MenuItemImage
          src={item.imageUrl}
          alt={item.name}
          priority={imagePriority}
          crop={item.imageCrop}
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
          <p className="mt-1 text-base font-bold text-accent sm:text-lg">
            {formatPrice(item.price)}
          </p>
        </div>

        <p className="mb-2 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
          {item.description}
        </p>

        <AddToCartButton
          onAdd={handleAdd}
          confirm={!onCustomize}
          fullWidth
          idleIcon={<Plus className="h-3.5 w-3.5" />}
          idleLabel="Add to Cart"
          className="mt-auto"
        />
      </div>
    </m.article>
  );
}

export const MenuItemCard = memo(MenuItemCardComponent);
