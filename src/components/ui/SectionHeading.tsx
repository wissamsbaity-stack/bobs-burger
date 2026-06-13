"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "space-y-3",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-bold tracking-tight text-cream md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base text-muted md:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
