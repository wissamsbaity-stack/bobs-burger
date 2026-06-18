"use client";

import Image from "next/image";

export function AdminBrandMark({
  restaurantName,
  logoUrl,
  layout = "centered",
}: {
  restaurantName: string;
  logoUrl: string;
  layout?: "centered" | "inline";
}) {
  if (layout === "inline") {
    return (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={logoUrl}
            alt={restaurantName}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg tracking-wide text-accent lg:text-xl">
            {restaurantName}
          </p>
          <p className="text-xs text-muted">Admin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex justify-center">
        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/10">
          <Image
            src={logoUrl}
            alt={restaurantName}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      </div>
      <p className="font-display text-2xl tracking-wide text-accent sm:text-3xl">
        {restaurantName}
      </p>
      <p className="mt-1 text-sm font-medium text-cream/80">Admin</p>
    </div>
  );
}
