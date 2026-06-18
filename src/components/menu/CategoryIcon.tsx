import {
  CATEGORY_ICON_MAP,
  DEFAULT_CATEGORY_ICON,
  resolveCategoryIconKey,
} from "@/lib/category-icons";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
  icon?: string | null;
  className?: string;
  size?: number;
}

export function CategoryIcon({
  icon,
  className,
  size = 24,
}: CategoryIconProps) {
  const key = resolveCategoryIconKey(icon);
  const Icon = CATEGORY_ICON_MAP[key] ?? CATEGORY_ICON_MAP[DEFAULT_CATEGORY_ICON];

  return (
    <Icon
      className={cn("shrink-0", className)}
      size={size}
      aria-hidden
    />
  );
}
