"use client";

import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/utils";

export function OrderSummary() {
  const { items, subtotal, deliveryFee, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-cream/5 bg-surface-raised p-6 text-center">
        <p className="text-cream/50">No items in your cart</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cream/5 bg-surface-raised p-6">
      <h3 className="mb-5 text-lg font-semibold text-cream">Order Summary</h3>

      <ul className="mb-5 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <p className="font-medium text-cream">
                  {item.name}{" "}
                  <span className="text-cream/50">×{item.quantity}</span>
                </p>
                <p className="shrink-0 text-sm font-medium text-cream">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
              {item.notes ? (
                <p className="mt-0.5 text-xs text-cream/40">
                  Note: {item.notes}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-cream/5 pt-4 text-sm">
        <div className="flex justify-between text-cream/60">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-cream/60">
          <span>Delivery Fee</span>
          <span>{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex justify-between border-t border-cream/5 pt-3 text-base font-semibold text-cream">
          <span>Total</span>
          <span className="text-accent">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
