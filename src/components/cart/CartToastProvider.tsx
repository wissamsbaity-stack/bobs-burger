"use client";

import { useEffect, useRef, useState } from "react";
import { CartToast } from "@/components/cart/CartToast";
import { useCart } from "@/contexts/CartContext";

const AUTO_DISMISS_MS = 2500;

export function CartToastProvider() {
  const { openCart } = useCart();
  const [toast, setToast] = useState<{ show: boolean; name: string }>({
    show: false,
    name: "",
  });
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setToast((t) => ({ ...t, show: false }));
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ name: string }>).detail;

      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }

      setToast({ show: true, name: detail.name });

      dismissTimerRef.current = setTimeout(() => {
        setToast((t) => ({ ...t, show: false }));
        dismissTimerRef.current = null;
      }, AUTO_DISMISS_MS);
    };

    window.addEventListener("cart:item-added", handler);
    return () => {
      window.removeEventListener("cart:item-added", handler);
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  return (
    <CartToast
      show={toast.show}
      itemName={toast.name}
      onClose={dismiss}
      onViewCart={openCart}
    />
  );
}
