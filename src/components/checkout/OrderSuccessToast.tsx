"use client";

import { m, AnimatePresence } from "@/lib/motion";
import { Check } from "lucide-react";

interface OrderSuccessToastProps {
  open: boolean;
}

export function OrderSuccessToast({ open }: OrderSuccessToastProps) {
  return (
    <AnimatePresence>
      {open ? (
        <m.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="fixed left-1/2 top-6 z-[110] w-[min(100%-2rem,24rem)] -translate-x-1/2 rounded-2xl border border-accent/30 bg-surface-overlay p-4 shadow-[0_16px_48px_-12px_rgba(255,92,0,0.45)]"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
              <Check className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-cream">
                Order received successfully!
              </p>
              <p className="mt-0.5 text-sm text-muted">
                The restaurant has received your order.
              </p>
            </div>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
