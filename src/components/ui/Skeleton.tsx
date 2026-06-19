import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-white/[0.04]",
        "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/[0.07] before:to-transparent before:content-['']",
        "motion-reduce:before:animate-none",
        className
      )}
    />
  );
}

export function MenuCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "menu-card-optimized overflow-hidden rounded-xl border border-white/5 bg-surface-raised",
        className
      )}
    >
      <Skeleton className="aspect-[5/4] w-full rounded-none sm:aspect-[4/3]" />
      <div className="space-y-2.5 p-2.5 sm:p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
    </div>
  );
}

export function MenuCardSkeletonCompact() {
  return (
    <div className="flex gap-3 overflow-hidden rounded-xl border border-white/5 bg-surface-raised p-2.5">
      <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2 py-0.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </div>
  );
}
