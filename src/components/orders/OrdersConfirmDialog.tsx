"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  ordersDangerButtonClassName,
  ordersPrimaryButtonClassName,
  ordersSecondaryButtonClassName,
} from "@/components/orders/orders-ui";

interface OrdersConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function OrdersConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "default",
  isLoading = false,
  onConfirm,
  onCancel,
}: OrdersConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const scrollEl = document.querySelector(
      ".orders-app-scroll"
    ) as HTMLElement | null;
    const prevOverflow = scrollEl?.style.overflow ?? "";
    if (scrollEl) {
      scrollEl.style.overflow = "hidden";
    }

    return () => {
      if (scrollEl) {
        scrollEl.style.overflow = prevOverflow;
      }
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="orders-touch-btn absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="orders-confirm-title"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-surface-overlay p-6 shadow-card"
      >
        <h3
          id="orders-confirm-title"
          className="font-display text-2xl tracking-wide text-cream"
        >
          {title}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-muted">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={cn(
              ordersSecondaryButtonClassName,
              "px-4 py-2.5 text-sm"
            )}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              tone === "danger"
                ? cn(ordersDangerButtonClassName, "border-0 bg-red-600 text-white")
                : ordersPrimaryButtonClassName,
              "px-4 py-2.5 text-sm"
            )}
          >
            {isLoading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
