import type { Money } from "@/lib/shopify/types";
import { cn, formatPrice, isOnSale } from "@/lib/utils";

export function Price({
  price,
  compareAt = null,
  className,
  size = "md",
}: {
  price: Money;
  compareAt?: Money | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const onSale = isOnSale(price, compareAt);
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  } as const;

  return (
    <span className={cn("inline-flex items-baseline gap-2", sizes[size], className)}>
      <span className={cn("font-medium", onSale && "text-danger")}>
        {formatPrice(price)}
      </span>
      {onSale && compareAt && (
        <span className="text-ink-soft/60 line-through text-[0.85em]">
          {formatPrice(compareAt)}
        </span>
      )}
    </span>
  );
}
