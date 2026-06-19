"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "@/lib/motion";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useCart } from "@/contexts/CartContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useIsMobile } from "@/hooks/useIsMobile";
import { modalSpring, overlayFade } from "@/lib/motion-presets";
import { cn, formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";

interface AddToCartModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

const sheetSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 36,
  mass: 0.9,
};

export function AddToCartModal({ item, onClose }: AddToCartModalProps) {
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const { addItem } = useCart();
  const isMobile = useIsMobile();

  useBodyScrollLock(Boolean(item));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (item) {
      setNotes("");
      setQuantity(1);
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  const handleAdd = () => {
    if (!item) return;

    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      notes,
      quantity,
    });
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {item ? (
        <div className="fixed inset-0 z-[60]" role="presentation">
          <m.button
            type="button"
            aria-label="Close modal"
            key="add-to-cart-backdrop"
            initial={overlayFade.initial}
            animate={overlayFade.animate}
            exit={overlayFade.exit}
            transition={overlayFade.transition}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div
            className={cn(
              "absolute inset-0 flex pointer-events-none",
              isMobile ? "items-end" : "items-center justify-center p-4 sm:p-6"
            )}
          >
            <m.div
              key={`add-to-cart-panel-${item.id}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-to-cart-title"
              initial={
                isMobile
                  ? { y: "100%" }
                  : { opacity: 0, y: 28, scale: 0.97 }
              }
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={
                isMobile
                  ? { y: "100%", opacity: 1, scale: 1 }
                  : { opacity: 0, y: 20, scale: 0.97 }
              }
              transition={isMobile ? sheetSpring : modalSpring}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "pointer-events-auto flex w-full flex-col overflow-hidden border border-cream/10 bg-surface-raised shadow-2xl",
                isMobile
                  ? "max-h-[88vh] rounded-t-3xl"
                  : "max-h-[90vh] max-w-lg rounded-3xl"
              )}
            >
              <div className="relative shrink-0">
                <div className="relative aspect-[16/10] max-h-[36vh] sm:aspect-video sm:max-h-none">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 512px"
                    priority
                  />
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-cream backdrop-blur-sm transition-colors hover:bg-black/70 motion-safe:active:scale-90 sm:right-4 sm:top-4"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div
                className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5 sm:p-6"
              >
                <div>
                  <h3
                    id="add-to-cart-title"
                    className="text-xl font-bold text-cream"
                  >
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-cream/50">
                    {item.description}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-mustard">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <Textarea
                  label="Special instructions"
                  placeholder="No pickles, extra sauce, well done..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-cream/70">
                    Quantity
                  </span>
                  <div className="flex items-center gap-3 rounded-full border border-cream/10 bg-surface p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-cream/70 hover:bg-cream/10 motion-safe:active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold text-cream">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-cream/70 hover:bg-cream/10 motion-safe:active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleAdd}
                >
                  Add to Cart — {formatPrice(item.price * quantity)}
                </Button>
              </div>
            </m.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
