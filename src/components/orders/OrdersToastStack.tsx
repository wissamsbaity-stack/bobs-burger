"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export interface OrdersToastItem {
  id: string;
  title: string;
  message: string;
}

interface OrdersToastStackProps {
  toasts: OrdersToastItem[];
  onDismiss: (id: string) => void;
}

export function OrdersToastStack({ toasts, onDismiss }: OrdersToastStackProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[90] flex w-[min(100%,22rem)] flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="pointer-events-auto overflow-hidden rounded-2xl border border-accent/30 bg-surface-overlay shadow-[0_16px_48px_-12px_rgba(255,92,0,0.45)]"
          >
            <div className="flex items-start gap-3 p-4">
              <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-cream">{toast.title}</p>
                <p className="mt-0.5 text-sm text-muted">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-lg p-1 text-muted transition hover:bg-white/5 hover:text-cream"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
