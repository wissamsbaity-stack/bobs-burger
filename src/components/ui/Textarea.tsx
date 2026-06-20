import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelHint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, labelHint, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        {label ? (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-cream/80"
          >
            {label}
            {labelHint ? (
              <span className="ml-1.5 text-xs font-normal text-muted">
                {labelHint}
              </span>
            ) : null}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-[100px] w-full resize-y rounded-xl border border-cream/10 bg-surface-raised px-4 py-3 text-cream placeholder:text-cream/30 transition-colors focus:border-mustard/50 focus:outline-none focus:ring-2 focus:ring-mustard/20",
            error && "border-ketchup/50 focus:border-ketchup/50 focus:ring-ketchup/20",
            className
          )}
          {...props}
        />
        {error ? <p className="text-sm text-ketchup">{error}</p> : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
