"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CartCountBadgeProps {
  count: number;
  className?: string;
}

export function CartCountBadge({ count, className }: CartCountBadgeProps) {
  if (count <= 0) return null;

  const label = count > 99 ? "99+" : count;

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={label}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 520,
          damping: 26,
          mass: 0.6,
        }}
        className={className}
      >
        {label}
      </motion.span>
    </AnimatePresence>
  );
}
