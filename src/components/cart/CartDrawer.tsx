"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { Button } from "@/components/ui/Button";
import { drawerSpring, overlayFade } from "@/lib/motion-presets";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    deliveryFee,
    total,
    itemCount,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            key="cart-backdrop"
            initial={overlayFade.initial}
            animate={overlayFade.animate}
            exit={overlayFade.exit}
            transition={overlayFade.transition}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={drawerSpring}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-cream/5 bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-cream/5 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-mustard" />
                <h2 className="text-lg font-semibold text-cream">
                  Your Cart
                  {itemCount > 0 ? (
                    <span className="ml-2 text-sm font-normal text-cream/50">
                      ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </span>
                  ) : null}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full p-2 text-cream/50 transition-colors hover:bg-cream/10 hover:text-cream motion-safe:active:scale-90"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream/5">
                    <ShoppingBag className="h-8 w-8 text-cream/30" />
                  </div>
                  <p className="font-medium text-cream/70">Your cart is empty</p>
                  <p className="mt-1 text-sm text-cream/40">
                    Browse our menu and add your favorites
                  </p>
                  <Link href="/menu" onClick={closeCart} className="mt-6">
                    <Button variant="primary">View Menu</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 ? (
              <div className="border-t border-cream/5 px-5 py-5">
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex justify-between text-cream/60">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-cream/60">
                    <span>Delivery</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-cream/5 pt-2 text-base font-semibold text-cream">
                    <span>Total</span>
                    <span className="text-mustard">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link href="/checkout" onClick={closeCart}>
                  <Button variant="primary" size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
