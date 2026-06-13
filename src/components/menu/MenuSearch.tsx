"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  className?: string;
}

export function MenuSearch({
  value,
  onChange,
  resultCount,
  className,
}: MenuSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cream/30" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search burgers, sides, shakes..."
        className="w-full rounded-2xl border border-cream/10 bg-surface-raised py-3.5 pl-12 pr-12 text-cream placeholder:text-cream/30 transition-colors focus:border-mustard/50 focus:outline-none focus:ring-2 focus:ring-mustard/20"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-cream/40 transition-colors hover:bg-cream/10 hover:text-cream"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      {value && resultCount !== undefined ? (
        <p className="mt-2 text-sm text-cream/40">
          {resultCount} {resultCount === 1 ? "result" : "results"} found
        </p>
      ) : null}
    </div>
  );
}
