import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "featured" | "popular" | "tag";
  className?: string;
}

const variants = {
  default: "bg-cream/10 text-cream/80",
  featured: "bg-mustard/20 text-mustard",
  popular: "bg-ketchup/20 text-ketchup",
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
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
