"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

export function CartButton() {
  const { itemCount, toggleCart } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-cream/5 text-cream transition-colors hover:bg-mustard/20 hover:text-mustard"
      aria-label={`Open cart, ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5" />
      <span
        className={cn(
          "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ketchup px-1 text-xs font-bold text-cream transition-transform",
          itemCount > 0 ? "scale-100" : "scale-0"
        )}
      >
        {itemCount > 99 ? "99+" : itemCount}
      </span>
    </button>
  );
}
