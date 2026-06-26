"use client";

import { memo, useCallback, useState } from "react";
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
  "menu-card-optimized menu-product-card menu-list-card group relative flex gap-4 overflow-hidden rounded-2xl border bg-surface-raised p-4 sm:gap-5 sm:p-[1.125rem]";

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
      <div className="relative w-[40%] max-w-[11rem] shrink-0 overflow-visible sm:max-w-[12rem]">
        <MenuItemImage
          src={item.imageUrl}
          alt={item.name}
          variant="list"
          priority={imagePriority}
          crop={item.imageCrop}
        />

        <div
          className="menu-list-add-backdrop pointer-events-none absolute bottom-0 right-0 z-10 h-9 w-9 translate-x-[18%] translate-y-[18%] rounded-full"
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
          whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
          className={cn(
            "menu-list-add-btn absolute bottom-0 right-0 z-20 flex h-[34px] w-[34px] translate-x-[18%] translate-y-[18%] items-center justify-center rounded-full text-white transition-colors motion-safe:duration-200",
            justAdded ? "bg-green-500" : "bg-accent hover:bg-accent-hover"
          )}
        >
          {justAdded ? (
            <Check className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          )}
        </m.button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center py-1 sm:py-1.5">
        <div className="mb-2 flex flex-wrap items-start gap-2">
          <h3
            className="min-w-0 flex-1 text-[17px] font-semibold leading-snug text-cream sm:text-lg"
            title={item.name}
          >
            {item.name}
          </h3>
          {item.isPopular ? <Badge variant="popular">Popular</Badge> : null}
        </div>

        {item.description ? (
          <p className="mb-2.5 line-clamp-2 text-sm leading-relaxed text-muted sm:mb-3 sm:text-[15px]">
            {item.description}
          </p>
        ) : null}

        <p className="text-lg font-bold leading-none text-accent sm:text-xl">
          {formatPrice(item.price)}
        </p>
      </div>
    </m.article>
  );
}

export const MenuItemCard = memo(MenuItemCardComponent);
