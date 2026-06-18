import { cn } from "@/lib/utils";

// Compact star rating sourced from Judge.me values synced into Shopify
// metafields (product.rating / product.ratingCount).
export function Rating({
  rating,
  count,
  className,
}: {
  rating: number | null;
  count?: number | null;
  className?: string;
}) {
  if (rating == null) return null;
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={cn("flex items-center gap-1.5 text-sm", className)} aria-label={`${rating} de 5 estrellas`}>
      <div className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rounded - (i - 1)));
          return (
            <span key={i} className="relative inline-block leading-none text-stone">
              ★
              <span
                className="absolute inset-0 overflow-hidden text-accent"
                style={{ width: `${fill * 100}%` }}
              >
                ★
              </span>
            </span>
          );
        })}
      </div>
      {count != null && <span className="text-ink-soft/70">({count})</span>}
    </div>
  );
}
