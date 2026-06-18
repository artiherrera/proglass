"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import type { CartLine } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";

export function CartLineItem({
  line,
  onNavigate,
}: {
  line: CartLine;
  onNavigate?: () => void;
}) {
  const { updateItem, removeItem, isUpdating } = useCart();
  const { merchandise } = line;
  const image = merchandise.image ?? merchandise.product.featuredImage;
  const options = merchandise.selectedOptions
    .filter((o) => o.value !== "Default Title")
    .map((o) => o.value)
    .join(" · ");

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/products/${merchandise.product.handle}`}
        onClick={onNavigate}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-stone-soft"
      >
        {image && (
          <Image
            src={image.url}
            alt={image.altText}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between gap-2">
          <Link
            href={`/products/${merchandise.product.handle}`}
            onClick={onNavigate}
            className="font-serif text-sm leading-snug hover:text-accent"
          >
            {merchandise.product.title}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(line.id)}
            disabled={isUpdating}
            aria-label="Quitar del carrito"
            className="text-ink-soft/50 transition-colors hover:text-danger disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {options && <span className="text-xs text-ink-soft/70">{options}</span>}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="inline-flex items-center rounded-full border border-stone">
            <button
              type="button"
              onClick={() =>
                updateItem(line.id, merchandise.id, line.quantity - 1)
              }
              disabled={isUpdating}
              aria-label="Reducir cantidad"
              className="px-2.5 py-1.5 text-ink-soft hover:text-ink disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <span className="min-w-6 text-center text-sm tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                updateItem(line.id, merchandise.id, line.quantity + 1)
              }
              disabled={isUpdating}
              aria-label="Aumentar cantidad"
              className="px-2.5 py-1.5 text-ink-soft hover:text-ink disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
          <span className="text-sm font-medium tabular-nums">
            {formatPrice(line.cost.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
