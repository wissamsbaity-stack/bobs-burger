import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-center">
        <Skeleton className="h-12 w-full max-w-xl rounded-2xl" />
      </div>
      <div className="mb-10 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-white/5 bg-surface-raised"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
