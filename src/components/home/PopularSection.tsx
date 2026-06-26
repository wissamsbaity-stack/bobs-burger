"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { StaggerGrid } from "@/components/motion/StaggerGrid";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { MenuItem } from "@/types/menu";

interface PopularSectionProps {
  items: MenuItem[];
}

export function PopularSection({ items }: PopularSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Trending Now"
            title="Popular Items"
            description="What everyone's ordering right now. Don't miss out."
          />
          <Link href="/menu">
            <Button variant="secondary">
              <Flame className="h-4 w-4" />
              See All Popular
            </Button>
          </Link>
        </div>

        <StaggerGrid className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
          {items.slice(0, 4).map((item) => (
            <MenuItemCard key={item.id} item={item} stagger />
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
