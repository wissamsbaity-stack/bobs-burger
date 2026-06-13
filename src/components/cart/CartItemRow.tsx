"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, updateNotes, removeItem } = useCart();

  return (
    <div className="space-y-3 rounded-2xl border border-cream/5 bg-surface-raised p-4">
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-cream">{item.name}</h4>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="shrink-0 rounded-lg p-1.5 text-cream/40 transition-colors hover:bg-ketchup/20 hover:text-ketchup"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm font-medium text-mustard">
            {formatPrice(item.price)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-cream/10 bg-surface p-1">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-cream">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm font-semibold text-cream">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      <div>
        <label
          htmlFor={`notes-${item.id}`}
          className="mb-1.5 block text-xs font-medium text-cream/50"
        >
          Item notes
        </label>
        <input
          id={`notes-${item.id}`}
          type="text"
          value={item.notes}
          onChange={(e) => updateNotes(item.id, e.target.value)}
          placeholder="e.g. no onions, extra sauce..."
          className="w-full rounded-lg border border-cream/10 bg-surface px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-mustard/50 focus:outline-none focus:ring-1 focus:ring-mustard/20"
        />
      </div>
    </div>
  );
}
