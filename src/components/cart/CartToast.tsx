"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CartToastProps {
  show: boolean;
  itemName: string;
  onClose: () => void;
  onViewCart: () => void;
}

export function CartToast({
  show,
  itemName,
  onClose,
  onViewCart,
}: CartToastProps) {
  return (
    <AnimatePresence>
      {show ? (
        <div
          className="pointer-events-none fixed inset-x-0 z-50 flex justify-center pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6"
          style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
        >
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto w-auto max-w-[90vw] overflow-hidden sm:max-w-md"
          >
            <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-accent/20 bg-surface-raised p-3 shadow-2xl sm:gap-4 sm:p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <Check className="h-5 w-5 text-accent" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate font-medium text-cream" title={itemName}>
                  {itemName}
                </p>
                <p className="truncate text-sm text-cream/50">Added to cart</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="shrink-0 whitespace-nowrap"
                onClick={() => {
                  onViewCart();
                  onClose();
                }}
              >
                <ShoppingBag className="h-4 w-4" aria-hidden />
                <span className="sm:hidden">Cart</span>
                <span className="hidden sm:inline">View Cart</span>
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
