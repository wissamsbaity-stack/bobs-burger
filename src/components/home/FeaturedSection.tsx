"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { MenuItem } from "@/types/menu";
import { useSettings } from "@/contexts/SettingsContext";

interface FeaturedSectionProps {
  items: MenuItem[];
}

export function FeaturedSection({ items }: FeaturedSectionProps) {
  const settings = useSettings();
  if (items.length === 0) return null;

  return (
    <section className="border-y border-cream/5 bg-surface-raised/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Chef's Selection"
            title="Featured Items"
            description={`Hand-picked favorites that define the ${settings.name} experience.`}
          />
          <Link href="/menu">
            <Button variant="outline">
              View Full Menu
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
