"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { CartCountBadge } from "@/components/cart/CartCountBadge";
import { cn } from "@/lib/utils";

export function FloatingCartButton() {
  const { itemCount, openCart } = useCart();
  const prefersReducedMotion = useReducedMotion();
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const handler = () => {
      setBump(true);
      window.setTimeout(() => setBump(false), 450);
    };
    window.addEventListener("cart:item-added", handler);
    return () => window.removeEventListener("cart:item-added", handler);
  }, []);

  return (
    <AnimatePresence>
      {itemCount > 0 ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: bump && !prefersReducedMotion ? [1, 1.06, 1] : 1,
          }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{
            scale: { duration: 0.35, ease: "easeOut" },
            default: { type: "spring", stiffness: 420, damping: 28 },
          }}
          onClick={openCart}
          className={cn(
            "fixed bottom-6 right-4 z-40 flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-white shadow-float motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:scale-105 motion-safe:active:scale-95 md:hidden"
          )}
          style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
          aria-label={`Open cart, ${itemCount} items`}
        >
          <ShoppingBag className="h-5 w-5" />
          Cart
          <CartCountBadge
            count={itemCount}
            className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold"
          />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
