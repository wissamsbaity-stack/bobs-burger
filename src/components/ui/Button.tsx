import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "whatsapp";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent/50",
  secondary: "bg-white/10 text-cream hover:bg-white/15",
  outline:
    "border border-white/20 bg-transparent text-cream hover:border-accent/50 hover:bg-accent-muted",
  ghost: "bg-transparent text-cream hover:bg-white/10",
  danger: "bg-red-600/20 text-red-400 hover:bg-red-600/30",
  whatsapp: "bg-whatsapp text-white hover:brightness-110",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

const motionClass =
  "motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.96]";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50",
          isLoading && "motion-safe:cursor-wait",
          motionClass,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span
            className="relative h-4 w-4 motion-safe:animate-spin"
            aria-hidden
          >
            <span className="absolute inset-0 rounded-full border-2 border-current/25" />
            <span className="absolute inset-0 rounded-full border-2 border-current border-t-transparent" />
          </span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
