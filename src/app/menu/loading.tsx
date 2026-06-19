import { MenuLoadingGrid } from "@/components/menu/MenuLoadingGrid";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="pb-20">
      <section className="border-b border-cream/5 bg-surface-raised/30 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-3 text-center">
            <Skeleton className="mx-auto h-4 w-24" />
            <Skeleton className="mx-auto h-10 w-64 max-w-full" />
            <Skeleton className="mx-auto h-5 w-80 max-w-full" />
          </div>
          <Skeleton className="mx-auto h-12 w-full max-w-xl rounded-2xl" />
        </div>
      </section>

      <div className="border-b border-white/5 bg-ink/[0.98]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-28 shrink-0 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <Skeleton className="mb-4 h-7 w-32 sm:mb-5" />
        <MenuLoadingGrid />
      </div>
    </div>
  );
}
