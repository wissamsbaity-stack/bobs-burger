"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m, useReducedMotion } from "@/lib/motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Total time the button stays in its green "Added" state before reverting.
 * Kept within the 800–1200ms premium-feedback window.
 */
const SUCCESS_DURATION_MS = 1100;

interface AddToCartButtonProps {
  /** Performs the actual add. Called on every click. */
  onAdd: () => void;
  /**
   * When true, play the green success animation after a click.
   * Set to false when the click instead opens a customization modal
   * (the modal handles its own confirmation).
   */
  confirm?: boolean;
  fullWidth?: boolean;
  idleIcon?: ReactNode;
  idleLabel?: string;
  addedLabel?: string;
  className?: string;
}

export function AddToCartButton({
  onAdd,
  confirm = true,
  fullWidth = false,
  idleIcon,
  idleLabel = "Add to Cart",
  addedLabel = "Added",
  className,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleClick = useCallback(() => {
    onAdd();
    if (!confirm) return;

    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAdded(false);
      timerRef.current = null;
    }, SUCCESS_DURATION_MS);
  }, [onAdd, confirm]);

  return (
    <m.button
      type="button"
      onClick={handleClick}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      animate={
        added && !prefersReducedMotion
          ? { scale: [1, 0.92, 1.05, 1] }
          : { scale: 1 }
      }
      transition={
        added
          ? { duration: 0.42, ease: "easeOut", times: [0, 0.3, 0.65, 1] }
          : { duration: 0.18 }
      }
      aria-label={added ? addedLabel : undefined}
      className={cn(
        "relative inline-flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-full px-3 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        added
          ? "border border-transparent bg-emerald-500 text-white focus-visible:ring-emerald-400/50"
          : "border border-white/20 bg-transparent text-cream hover:border-accent/50 hover:bg-accent-muted focus-visible:ring-accent/50",
        fullWidth ? "w-full" : "w-fit",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <m.span
            key="added"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.16 }}
            className="inline-flex items-center gap-1.5"
          >
            <m.span
              initial={prefersReducedMotion ? false : { scale: 0, rotate: -35 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 520, damping: 17, delay: 0.03 }
              }
              className="inline-flex"
            >
              <Check className="h-4 w-4" aria-hidden />
            </m.span>
            {addedLabel}
          </m.span>
        ) : (
          <m.span
            key="idle"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.16 }}
            className="inline-flex items-center gap-1.5"
          >
            {idleIcon}
            {idleLabel}
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  );
}
