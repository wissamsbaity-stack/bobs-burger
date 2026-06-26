"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuExpandableSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  className?: string;
}

const EXPANDED_WIDTH = "17.5rem";

function focusSearchInput(input: HTMLInputElement) {
  input.readOnly = true;
  input.focus({ preventScroll: true });
  input.readOnly = false;
}

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
    inputRef.current?.blur();
  }, []);

  const openAndFocus = useCallback(() => {
    setIsOpen(true);
    const input = inputRef.current;
    if (!input) return;

    focusSearchInput(input);

    // iOS Safari may defer focus until after paint when width expands.
    requestAnimationFrame(() => {
      focusSearchInput(input);
    });
  }, []);

  const handleOpenPointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      openAndFocus();
    },
    [openAndFocus]
  );

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
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
          <Search
            className="pointer-events-none h-[18px] w-[18px] text-cream/70"
            aria-hidden
          />
          {!isOpen ? (
            <button
              type="button"
              onPointerDown={handleOpenPointerDown}
              className="menu-expandable-search-trigger absolute inset-0 flex items-center justify-center text-cream/70"
              aria-label="Open search"
            />
          ) : null}
        </div>

        <div
          className="menu-expandable-search-field flex h-11 min-w-0 items-center overflow-hidden ease-in-out"
          style={{
            width: isOpen ? EXPANDED_WIDTH : "0px",
            transition: "width 280ms ease-in-out",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search menu..."
            tabIndex={isOpen ? 0 : -1}
            aria-hidden={!isOpen}
            className={cn(
              "h-full min-w-0 flex-1 bg-transparent pr-2 text-sm text-cream placeholder:text-cream/35 focus:outline-none",
              !isOpen && "pointer-events-none opacity-0"
            )}
            aria-label="Search menu"
          />
          <button
            type="button"
            onClick={handleClose}
            tabIndex={isOpen ? 0 : -1}
            aria-hidden={!isOpen}
            className={cn(
              "menu-expandable-search-close mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-cream/50 transition-colors hover:bg-white/10 hover:text-cream",
              !isOpen && "pointer-events-none opacity-0"
            )}
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
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
