"use client";

import { useState } from "react";
import {
  CATEGORY_ICON_MAP,
  CATEGORY_ICON_OPTIONS,
  DEFAULT_CATEGORY_ICON,
} from "@/lib/category-icons";
import { cn } from "@/lib/utils";

export function CategoryIconPicker({
  name = "icon",
  defaultValue,
}: {
  name?: string;
  defaultValue?: string | null;
}) {
  const [selected, setSelected] = useState(
    defaultValue && CATEGORY_ICON_MAP[defaultValue]
      ? defaultValue
      : DEFAULT_CATEGORY_ICON
  );

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-cream/80">Icon</span>
      <input type="hidden" name={name} value={selected} />
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {CATEGORY_ICON_OPTIONS.map((option) => {
          const Icon = CATEGORY_ICON_MAP[option.id];
          const active = selected === option.id;

          return (
            <button
              key={option.id}
              type="button"
              title={option.label}
              onClick={() => setSelected(option.id)}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl border p-2 transition-colors",
                active
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-white/10 bg-ink text-muted hover:border-white/20 hover:text-cream"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="line-clamp-1 text-[10px] leading-tight">
                {option.label.split(" / ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
