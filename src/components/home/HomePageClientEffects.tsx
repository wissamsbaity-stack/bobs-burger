"use client";

import { useLayoutEffect, useState } from "react";
import { OrderSuccessToast } from "@/components/checkout/OrderSuccessToast";
import { consumeOrderSuccessForHome } from "@/lib/order-success";
import { scrollToTopInstant } from "@/lib/scroll";

/**
 * Ensures the homepage opens at scroll 0 and shows a post-checkout success toast.
 */
export function HomePageClientEffects() {
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  useLayoutEffect(() => {
    scrollToTopInstant();

    if (consumeOrderSuccessForHome()) {
      setShowOrderSuccess(true);
      window.setTimeout(() => setShowOrderSuccess(false), 4000);
    }

    const handlePageShow = () => {
      scrollToTopInstant();
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return <OrderSuccessToast open={showOrderSuccess} />;
}
