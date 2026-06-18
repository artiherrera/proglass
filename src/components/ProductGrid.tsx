import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  className,
  priorityCount = 4,
}: {
  products: Product[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}
