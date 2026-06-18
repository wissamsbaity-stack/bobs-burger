"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

interface RestaurantBrandProps {
  size?: "sm" | "md";
  showName?: boolean;
  className?: string;
  asLink?: boolean;
}

export function RestaurantBrand({
  size = "md",
  showName = true,
  className,
  asLink = true,
}: RestaurantBrandProps) {
  const settings = useSettings();
  const logoClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const textClass =
    size === "sm" ? "font-display text-base" : "font-display text-lg";

  const content = (
    <>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-lg",
          logoClass
        )}
      >
        <Image
          src={settings.branding.logo}
          alt={settings.name}
          fill
          className="object-cover"
          sizes={size === "sm" ? "32px" : "40px"}
        />
      </div>
      {showName ? (
        <span
          className={cn(
            "font-bold leading-tight tracking-wide text-cream",
            textClass
          )}
        >
          {settings.name}
        </span>
      ) : null}
    </>
  );

  if (!asLink) {
    return (
      <div className={cn("flex items-center gap-3", className)}>{content}</div>
    );
  }

  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
    >
      {content}
    </Link>
  );
}
