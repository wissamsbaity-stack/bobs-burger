import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "popular" | "bestSeller" | "tag";
  className?: string;
}

const variants = {
  default: "bg-cream/10 text-cream/80",
  popular: "bg-accent/90 text-white shadow-sm",
  bestSeller: "bg-cream text-ink shadow-sm",
  tag: "bg-surface-overlay text-cream/60",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
