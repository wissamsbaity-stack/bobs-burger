"use client";

import { cn } from "@/lib/utils";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
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
        <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-white/5 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50",
              tone === "danger"
                ? "bg-red-600 hover:bg-red-500"
                : "bg-accent hover:bg-accent-hover"
            )}
          >
            {isLoading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
