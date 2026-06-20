"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { m } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryIcon } from "@/components/menu/CategoryIcon";
import { StaggerGrid } from "@/components/motion/StaggerGrid";
import { staggerItemVariants } from "@/lib/motion-presets";
import type { Category } from "@/types/menu";
import { useSettings } from "@/contexts/SettingsContext";

interface CategoriesPreviewProps {
  categories: Category[];
}

export function CategoriesPreview({ categories }: CategoriesPreviewProps) {
  const settings = useSettings();
  const preview = categories.slice(0, 6);

  return (
    <section className="border-t border-white/5 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="From the menu"
          description={`Appetizers, beef and chicken burgers, dips, and drinks — all from the live ${settings.name} menu.`}
          align="center"
          className="mb-12"
        />

        <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((category) => (
            <m.div key={category.id} variants={staggerItemVariants}>
              <Link
                href={`/menu?category=${category.slug}`}
                className="group flex flex-col rounded-2xl border border-white/5 bg-surface-raised p-6 transition-all hover:border-accent/30 hover:shadow-card motion-safe:active:scale-[0.98]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-muted text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <CategoryIcon icon={category.icon} size={24} />
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
            </m.div>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
