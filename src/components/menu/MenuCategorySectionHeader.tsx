import { cn } from "@/lib/utils";

import type { RefObject } from "react";

interface MenuCategorySectionHeaderProps {
  title: string;
  className?: string;
  /** For scroll-into-view when switching categories */
  headerRef?: RefObject<HTMLDivElement | null>;
}

export function MenuCategorySectionHeader({
  title,
  className,
  headerRef,
}: MenuCategorySectionHeaderProps) {
  return (
    <div
      ref={headerRef}
      className={cn(
        "menu-category-header scroll-mt-[var(--menu-category-scroll-offset)] flex w-full items-center justify-center rounded-2xl px-5 py-4 sm:px-6 sm:py-[1.125rem]",
        className
      )}
    >
      <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
        {title}
      </h2>
    </div>
  );
}
