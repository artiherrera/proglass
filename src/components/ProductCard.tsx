import Image from "next/image";
import Link from "next/link";

import { Price } from "@/components/Price";
import { Rating } from "@/components/Rating";
import type { Product } from "@/lib/shopify/types";
import { cn, discountPercent, isOnSale } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.minVariantPrice;
  const onSale = isOnSale(price, compareAt);
  const soldOut = !product.availableForSale;

  return (
    <Link
      href={`/products/${product.handle}`}
      className={cn("group flex flex-col", className)}
    >
      <div className="relative aspect-square overflow-hidden rounded-card bg-stone-soft">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-soft/40">
            Sin imagen
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {onSale && (
            <span className="rounded-full bg-danger px-2.5 py-1 text-xs font-medium text-paper">
              -{discountPercent(price, compareAt)}%
            </span>
          )}
          {soldOut && (
            <span className="rounded-full bg-ink/80 px-2.5 py-1 text-xs font-medium text-paper">
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {product.vendor && (
          <span className="text-xs uppercase tracking-wider text-ink-soft/60">
            {product.vendor}
          </span>
        )}
        <h3 className="font-serif text-base leading-snug text-ink group-hover:text-accent">
          {product.title}
        </h3>
        <Rating rating={product.rating} count={product.ratingCount} />
        <Price price={price} compareAt={compareAt} className="mt-0.5" />
      </div>
    </Link>
  );
}
