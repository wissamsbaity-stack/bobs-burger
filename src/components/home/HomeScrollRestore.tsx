"use client";

import { useEffect } from "react";

/**
 * Ensures the homepage always opens at scroll position 0.
 * Handles bfcache restores (mobile Safari back/forward) as well.
 */
export function HomeScrollRestore() {
  useEffect(() => {
    const scrollTop = () => {
      window.scrollTo(0, 0);
    };

    scrollTop();

    window.addEventListener("pageshow", scrollTop);
    return () => window.removeEventListener("pageshow", scrollTop);
  }, []);

  return null;
}
