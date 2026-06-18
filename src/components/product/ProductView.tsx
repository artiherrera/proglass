"use client";

import { useEffect, useMemo, useState } from "react";

import { Price } from "@/components/Price";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Rating } from "@/components/Rating";
import { useCart } from "@/components/cart/cart-context";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

function findVariant(
  product: Product,
  selected: Record<string, string>,
): ProductVariant | undefined {
  return product.variants.find((variant) =>
    variant.selectedOptions.every((opt) => selected[opt.name] === opt.value),
  );
}

export function ProductView({ product }: { product: Product }) {
  const { addItem, isUpdating } = useCart();

  const defaultVariant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (defaultVariant?.selectedOptions ?? []).map((o) => [o.name, o.value]),
    ),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [adding, setAdding] = useState(false);

  const selectedVariant = useMemo(
    () => findVariant(product, selected) ?? defaultVariant,
    [product, selected, defaultVariant],
  );

  // Hide selectors for products that have no real options.
  const hasOptions =
    product.options.length > 0 &&
    !(product.options.length === 1 && product.options[0].values[0] === "Default Title");

  // Fire GA4 / Klaviyo "view item" once on mount.
  useEffect(() => {
    trackViewItem(product, selectedVariant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chooseOption(name: string, value: string) {
    const next = { ...selected, [name]: value };
    setSelected(next);
    const variant = findVariant(product, next);
    if (variant?.image) {
      const idx = product.images.findIndex((img) => img.url === variant.image?.url);
      if (idx >= 0) setActiveIndex(idx);
    }
  }

  async function handleAdd() {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      await addItem(selectedVariant.id, 1);
      trackAddToCart(product, selectedVariant, 1);
    } finally {
      setAdding(false);
    }
  }

  const available = selectedVariant?.availableForSale ?? false;
  const busy = adding || isUpdating;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductGallery
        images={product.images}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        title={product.title}
      />

      <div className="flex flex-col">
        {product.vendor && (
          <span className="text-sm uppercase tracking-wider text-ink-soft/60">
            {product.vendor}
          </span>
        )}
        <h1 className="mt-1 font-serif text-3xl leading-tight text-ink sm:text-4xl">
          {product.title}
        </h1>

        <Rating rating={product.rating} count={product.ratingCount} className="mt-3" />

        <Price
          price={selectedVariant?.price ?? product.priceRange.minVariantPrice}
          compareAt={selectedVariant?.compareAtPrice ?? null}
          size="lg"
          className="mt-4"
        />

        {hasOptions && (
          <div className="mt-8 flex flex-col gap-6">
            {product.options.map((option) => (
              <div key={option.id}>
                <span className="text-sm font-medium text-ink">{option.name}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isSelected = selected[option.name] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => chooseOption(option.name, value)}
                        className={cn(
                          "min-w-11 rounded-full border px-4 py-2 text-sm transition-colors",
                          isSelected
                            ? "border-ink bg-ink text-paper"
                            : "border-stone bg-paper text-ink hover:border-ink",
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!available || busy}
          className={cn(
            "mt-8 flex h-14 items-center justify-center rounded-full px-8 text-sm font-medium transition-colors",
            available
              ? "bg-accent text-paper hover:bg-accent-dark"
              : "cursor-not-allowed bg-stone text-ink-soft/60",
            busy && "opacity-70",
          )}
        >
          {!available
            ? "Agotado"
            : busy
              ? "Añadiendo…"
              : "Añadir al carrito"}
        </button>

        {product.descriptionHtml && (
          <div
            className="prose-sm mt-10 max-w-none border-t border-stone pt-8 text-sm leading-relaxed text-ink-soft [&_a]:text-accent [&_a]:underline [&_h2]:font-serif [&_h2]:text-ink [&_li]:my-1 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}
      </div>
    </div>
  );
}
