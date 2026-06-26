"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { Transition } from "framer-motion";
import { m, useReducedMotion } from "@/lib/motion";
import { Check, Plus } from "lucide-react";
import { MenuItemImage } from "@/components/menu/MenuItemImage";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/contexts/CartContext";
import {
  cardReveal,
  revealStagger,
  staggerItemVariants,
} from "@/lib/motion-presets";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
  onCustomize?: (item: MenuItem) => void;
  imagePriority?: boolean;
  revealIndex?: number;
  stagger?: boolean;
}

const cardBaseClass =
  "menu-card-optimized menu-product-card menu-list-card group relative flex gap-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-raised p-3 sm:gap-4 sm:p-3.5";

function MenuItemCardComponent({
  item,
  onCustomize,
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

  return (
    <m.article
      {...revealProps}
      animate={
        justAdded && !prefersReducedMotion
          ? { scale: [1, 0.985, 1.01, 1] }
          : undefined
      }
      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
      transition={pulseTransition}
      className={cardBaseClass}
    >
      <div className="relative w-[35%] max-w-[9.5rem] shrink-0 sm:max-w-[10.5rem]">
        <MenuItemImage
          src={item.imageUrl}
          alt={item.name}
          variant="list"
          priority={imagePriority}
          crop={item.imageCrop}
        />

        <div
          className="pointer-events-none absolute -bottom-0.5 -right-0.5 z-10 h-12 w-12 rounded-full bg-black/40 blur-md"
          aria-hidden
        />

        <m.button
          type="button"
          onClick={handleAdd}
          aria-label={
            onCustomize
              ? `Customize ${item.name}`
              : `Add ${item.name} to cart`
          }
          animate={
            justAdded && !prefersReducedMotion
              ? { scale: [1, 0.9, 1.08, 1] }
              : undefined
          }
          whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
          className={cn(
            "absolute -bottom-1 -right-1 z-20 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_4px_16px_rgba(0,0,0,0.45),0_0_20px_rgba(255,92,0,0.35)] ring-2 ring-ink/70 transition-colors motion-safe:duration-200",
            justAdded ? "bg-green-500" : "bg-accent hover:bg-accent-hover"
          )}
        >
          {justAdded ? (
            <Check className="h-5 w-5" strokeWidth={2.5} />
          ) : (
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          )}
        </m.button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3
            className="min-w-0 flex-1 text-base font-semibold leading-snug text-cream sm:text-[17px]"
            title={item.name}
          >
            {item.name}
          </h3>
          {item.isPopular ? <Badge variant="popular">Popular</Badge> : null}
        </div>

        <p className="mb-1.5 text-lg font-bold leading-none text-accent sm:text-xl">
          {formatPrice(item.price)}
        </p>

        {item.description ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        ) : null}
      </div>
    </m.article>
  );
}

export const MenuItemCard = memo(MenuItemCardComponent);
