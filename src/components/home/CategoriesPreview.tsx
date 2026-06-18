"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Beef, Cookie, CupSoda, Sandwich, Flame } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Category } from "@/types/menu";
import { useSettings } from "@/contexts/SettingsContext";

const categoryIcons: Record<string, React.ReactNode> = {
  sides: <Cookie className="h-6 w-6" />,
  "baked-potato": <Flame className="h-6 w-6" />,
  "wraps-and-subs": <Sandwich className="h-6 w-6" />,
  "beef-burger": <Beef className="h-6 w-6" />,
  "angus-burgers": <Beef className="h-6 w-6" />,
  "chicken-burger": <Flame className="h-6 w-6" />,
  upgrade: <Sandwich className="h-6 w-6" />,
  "soft-drink": <CupSoda className="h-6 w-6" />,
};

interface CategoriesPreviewProps {
  categories: Category[];
}

export function CategoriesPreview({ categories }: CategoriesPreviewProps) {
  const settings = useSettings();
  const preview = categories.filter((c) =>
    ["sides", "beef-burger", "angus-burgers", "chicken-burger", "wraps-and-subs", "value-meals"].includes(c.slug)
  );

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="From the menu"
          description={`Beef burgers, Angus stacks, Nashville chicken, sides, wraps, and more — all from the live ${settings.name} menu.`}
          align="center"
          className="mb-12"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={`/menu?category=${category.slug}`}
                className="group flex flex-col rounded-2xl border border-white/5 bg-surface-raised p-6 transition-all hover:border-accent/30 hover:shadow-card"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  {categoryIcons[category.slug] ?? (
                    <Beef className="h-6 w-6" />
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-cream">
                  {category.name}
                </h3>
                <p className="mb-4 flex-1 text-sm text-muted">
                  {category.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Browse
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
