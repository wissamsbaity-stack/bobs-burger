"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";

interface AddToCartModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function AddToCartModal({ item, onClose }: AddToCartModalProps) {
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!item) return null;

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      notes,
      quantity,
    });
    setNotes("");
    setQuantity(1);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg overflow-hidden rounded-3xl border border-cream/10 bg-surface-raised shadow-2xl"
        >
          <div className="relative aspect-video">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="512px"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-surface/80 p-2 text-cream backdrop-blur-sm transition-colors hover:bg-surface"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <h3 className="text-xl font-bold text-cream">{item.name}</h3>
              <p className="mt-1 text-sm text-cream/50">{item.description}</p>
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
              <span className="text-sm font-medium text-cream/70">Quantity</span>
              <div className="flex items-center gap-3 rounded-full border border-cream/10 bg-surface p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-cream/70 hover:bg-cream/10"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold text-cream">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-cream/70 hover:bg-cream/10"
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
