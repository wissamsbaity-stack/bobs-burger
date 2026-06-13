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
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
        >
          <div className="flex items-center gap-4 rounded-2xl border border-mustard/20 bg-surface-raised p-4 shadow-2xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mustard/20">
              <Check className="h-5 w-5 text-mustard" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-cream">{itemName}</p>
              <p className="text-sm text-cream/50">Added to cart</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onViewCart();
                onClose();
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              View Cart
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
