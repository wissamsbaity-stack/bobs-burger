"use client";

import { m } from "@/lib/motion";
import { staggerItemVariants } from "@/lib/motion-presets";
import { MenuCardSkeleton } from "@/components/ui/Skeleton";
import { StaggerGrid } from "@/components/motion/StaggerGrid";

export function MenuLoadingGrid() {
  return (
    <StaggerGrid
      animateOnMount
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <m.div key={i} variants={staggerItemVariants}>
          <MenuCardSkeleton />
        </m.div>
      ))}
    </StaggerGrid>
  );
}
