"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  className?: string;
}

const EXPANDED_WIDTH = "17.5rem";

export function MenuExpandableSearch({
  value,
  onChange,
  resultCount,
  className,
}: MenuExpandableSearchProps) {
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const collapse = useCallback(() => {
    setIsOpen(false);
    inputRef.current?.blur();
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    onChange("");
    collapse();
  }, [collapse, onChange]);

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
      <div
        className={cn(
          "menu-expandable-search flex h-11 items-center overflow-hidden rounded-full border border-white/10 bg-white/5",
          isOpen && "bg-white/[0.06] shadow-sm shadow-black/20"
        )}
      >
        <label
          htmlFor={inputId}
          className="menu-expandable-search-trigger flex h-11 w-11 shrink-0 cursor-pointer select-none items-center justify-center text-cream/70"
          aria-label="Search menu"
        >
          <Search className="pointer-events-none h-[18px] w-[18px]" aria-hidden />
        </label>

        <div
          className="menu-expandable-search-field flex h-11 shrink-0 items-center overflow-hidden"
          style={{
            width: isOpen ? EXPANDED_WIDTH : "0px",
            opacity: isOpen ? 1 : 0,
            transition: "width 280ms ease-in-out, opacity 280ms ease-in-out",
          }}
        >
          <div className="flex h-11 w-[17.5rem] min-w-[17.5rem] items-center">
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="Search menu..."
              className="h-full min-w-0 flex-1 bg-transparent pr-2 text-sm text-cream placeholder:text-cream/35 focus:outline-none"
              aria-label="Search menu"
            />
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClose}
              className="menu-expandable-search-close mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-cream/50 transition-colors hover:bg-white/10 hover:text-cream"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && value.trim() && resultCount !== undefined ? (
        <p className="absolute left-0 top-full mt-1 whitespace-nowrap text-xs text-cream/40">
          {resultCount} {resultCount === 1 ? "result" : "results"}
        </p>
      ) : null}
    </div>
  );
}
