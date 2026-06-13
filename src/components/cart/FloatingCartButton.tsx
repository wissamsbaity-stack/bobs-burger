"use client";

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

export function FloatingCartButton() {
  const { itemCount, openCart } = useCart();

  return (
    <AnimatePresence>
      {itemCount > 0 ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          onClick={openCart}
          className={cn(
            "fixed bottom-6 right-4 z-40 flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-float transition-transform hover:scale-105 active:scale-95 md:hidden"
          )}
          aria-label={`Open cart, ${itemCount} items`}
        >
          <ShoppingBag className="h-5 w-5" />
          Cart
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
