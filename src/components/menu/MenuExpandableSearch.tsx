"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { m } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MenuExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  className?: string;
}

const SEARCH_TRANSITION = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const,
};

export function MenuExpandableSearch({
  value,
  onChange,
  resultCount,
  className,
}: MenuExpandableSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const collapse = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    onChange("");
    collapse();
  }, [collapse, onChange]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (!value.trim()) collapse();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [collapse, isOpen, value]);

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <m.div
        layout
        initial={false}
        animate={{ width: isOpen ? "min(100%, 17.5rem)" : "2.75rem" }}
        transition={SEARCH_TRANSITION}
        className="overflow-hidden"
      >
        {isOpen ? (
          <div className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 shadow-sm shadow-black/20">
            <Search className="h-4 w-4 shrink-0 text-cream/40" aria-hidden />
            <input
              ref={inputRef}
              type="search"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search menu..."
              className="min-w-0 flex-1 bg-transparent text-sm text-cream placeholder:text-cream/35 focus:outline-none"
              aria-label="Search menu"
            />
            <button
              type="button"
              onClick={handleClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-cream/50 transition-colors hover:bg-white/10 hover:text-cream"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={open}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream/70 transition-colors hover:bg-white/10 hover:text-cream motion-safe:active:scale-[0.96]"
            aria-label="Open search"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
        )}
      </m.div>

      {isOpen && value.trim() && resultCount !== undefined ? (
        <p className="absolute left-0 top-full mt-1 whitespace-nowrap text-xs text-cream/40">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </p>
      ) : null}
    </div>
  );
}
