"use client";

// Thin, dependency-free wrappers around GA4 (gtag) and Klaviyo (_learnq).
// Every call is a no-op when the provider isn't loaded, so analytics is
// fully optional and never breaks the storefront.

import type { Cart, Product, ProductVariant } from "./shopify/types";

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  _learnq?: unknown[];
};

function getWindow(): GtagWindow | null {
  return typeof window === "undefined" ? null : (window as GtagWindow);
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const KLAVIYO_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY ?? "";

/** GA4 event. */
export function gaEvent(name: string, params: Record<string, unknown> = {}) {
  const w = getWindow();
  w?.gtag?.("event", name, params);
}

/** Klaviyo onsite tracking event. */
export function klaviyoEvent(name: string, properties: Record<string, unknown> = {}) {
  const w = getWindow();
  if (!w) return;
  w._learnq = w._learnq || [];
  w._learnq.push(["track", name, properties]);
}

// --- Common ecommerce events --------------------------------------------

export function trackViewItem(product: Product, variant?: ProductVariant) {
  const price = Number.parseFloat(
    (variant?.price ?? product.priceRange.minVariantPrice).amount,
  );
  gaEvent("view_item", {
    currency: product.priceRange.minVariantPrice.currencyCode,
    value: price,
    items: [{ item_id: product.handle, item_name: product.title, price }],
  });
  klaviyoEvent("Viewed Product", {
    ProductName: product.title,
    Handle: product.handle,
    Price: price,
  });
}

export function trackAddToCart(
  product: Product,
  variant: ProductVariant,
  quantity: number,
) {
  const price = Number.parseFloat(variant.price.amount);
  gaEvent("add_to_cart", {
    currency: variant.price.currencyCode,
    value: price * quantity,
    items: [
      {
        item_id: product.handle,
        item_name: product.title,
        item_variant: variant.title,
        price,
        quantity,
      },
    ],
  });
  klaviyoEvent("Added to Cart", {
    ProductName: product.title,
    VariantTitle: variant.title,
    Price: price,
    Quantity: quantity,
  });
}

export function trackBeginCheckout(cart: Cart) {
  gaEvent("begin_checkout", {
    currency: cart.cost.totalAmount.currencyCode,
    value: Number.parseFloat(cart.cost.totalAmount.amount),
    items: cart.lines.map((line) => ({
      item_id: line.merchandise.product.handle,
      item_name: line.merchandise.product.title,
      item_variant: line.merchandise.title,
      price: Number.parseFloat(line.merchandise.price.amount),
      quantity: line.quantity,
    })),
  });
}
