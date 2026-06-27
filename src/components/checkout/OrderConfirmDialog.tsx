"use client";

import { m, AnimatePresence } from "@/lib/motion";
import { Button } from "@/components/ui/Button";

interface OrderConfirmDialogProps {
  open: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function OrderConfirmDialog({
  open,
  isLoading = false,
  onConfirm,
  onCancel,
}: OrderConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <m.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onCancel}
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-confirm-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-surface-overlay p-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.75)]"
          >
            <h3
              id="order-confirm-title"
              className="font-display text-2xl tracking-wide text-cream"
            >
              Confirm your order?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Your order will be sent directly to the restaurant.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={onConfirm}
                isLoading={isLoading}
                className="w-full sm:w-auto"
              >
                Confirm Order
              </Button>
            </div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
