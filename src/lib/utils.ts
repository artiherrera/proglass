import type { Money } from "./shopify/types";

/** Tiny classnames joiner (no external deps). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Format a Shopify Money object using the user's locale. */
export function formatPrice(
  money: Money | { amount: string; currencyCode: string },
  locale = "es-MX",
): string {
  const amount = Number.parseFloat(money.amount);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currencyCode || "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/** True when compareAtPrice is meaningfully higher than price. */
export function isOnSale(
  price: { amount: string },
  compareAt: { amount: string } | null,
): boolean {
  if (!compareAt) return false;
  return Number.parseFloat(compareAt.amount) > Number.parseFloat(price.amount);
}

/** Discount percentage (rounded) between compareAt and price. */
export function discountPercent(
  price: { amount: string },
  compareAt: { amount: string } | null,
): number {
  if (!compareAt) return 0;
  const p = Number.parseFloat(price.amount);
  const c = Number.parseFloat(compareAt.amount);
  if (c <= p) return 0;
  return Math.round(((c - p) / c) * 100);
}

/** Shopify global IDs look like gid://shopify/ProductVariant/123 — grab the tail. */
export function parseGid(gid: string): string {
  return gid.split("/").pop() ?? gid;
}
