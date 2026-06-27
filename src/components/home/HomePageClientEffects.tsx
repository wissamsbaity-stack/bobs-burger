"use client";

import { useLayoutEffect } from "react";
import { scrollToTopInstant } from "@/lib/scroll";

/** Ensures the homepage opens at scroll position 0 (incl. Safari bfcache). */
export function HomePageClientEffects() {
  useLayoutEffect(() => {
    scrollToTopInstant();

    const handlePageShow = () => {
      scrollToTopInstant();
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return null;
}
