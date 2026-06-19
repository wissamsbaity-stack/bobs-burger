/** Shared motion presets — fast, subtle, mobile-friendly */

import type { Transition } from "framer-motion";

const easeOut = [0.25, 0.1, 0.25, 1] as const;

export const overlayFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeOut" } satisfies Transition,
};

export const panelSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 34,
  mass: 0.85,
};

export const drawerSpring = {
  type: "spring" as const,
  stiffness: 360,
  damping: 36,
  mass: 0.9,
};

export const modalSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.9,
};

export const categoryCrossFade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: easeOut } satisfies Transition,
};

export function revealStagger(index: number): Transition {
  return {
    duration: 0.32,
    delay: Math.min(index * 0.035, 0.12),
    ease: easeOut,
  };
}

export const cardReveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12, margin: "0px 0px -32px 0px" },
};
