"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { MenuItem } from "@/types/menu";

interface BurgerHighlightsProps {
  items: MenuItem[];
}

export function BurgerHighlights({ items }: BurgerHighlightsProps) {
  if (items.length === 0) return null;

  return (
    <section className="border-y border-white/5 bg-surface-raised py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="From the grill"
            title="Burger highlights"
            description="Signature stacks from our beef, Angus, and chicken lines — straight from the live menu."
          />
          <Link href="/menu">
            <Button variant="outline">
              View Full Menu
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((item, index) => (
            <MenuItemCard
              key={item.id}
              item={item}
              highlighted
              imagePriority={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
