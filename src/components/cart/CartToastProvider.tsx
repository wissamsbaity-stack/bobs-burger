"use client";

import { useEffect, useState } from "react";
import { CartToast } from "@/components/cart/CartToast";
import { useCart } from "@/contexts/CartContext";

export function CartToastProvider() {
  const { openCart } = useCart();
  const [toast, setToast] = useState<{ show: boolean; name: string }>({
    show: false,
    name: "",
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ name: string }>).detail;
      setToast({ show: true, name: detail.name });
      setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
    };

    window.addEventListener("cart:item-added", handler);
    return () => window.removeEventListener("cart:item-added", handler);
  }, []);

  return (
    <CartToast
      show={toast.show}
      itemName={toast.name}
      onClose={() => setToast((t) => ({ ...t, show: false }))}
      onViewCart={openCart}
    />
  );
}