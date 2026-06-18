"use client";

import Link from "next/link";

import { CartLineItem } from "@/components/cart/CartLineItem";
import { useCart } from "@/components/cart/cart-context";
import { trackBeginCheckout } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";

export function CartContents() {
  const { cart, isUpdating, error } = useCart();

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <h1 className="font-serif text-2xl text-ink">Tu carrito está vacío</h1>
        <p className="text-ink-soft">Descubre nuestros productos destacados.</p>
        <Link
          href="/collections"
          className="mt-2 rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper hover:bg-ink-soft"
        >
          Explorar colecciones
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
      <div className="lg:col-span-2">
        <h1 className="mb-6 font-serif text-3xl text-ink">Tu carrito</h1>
        <div className="divide-y divide-stone border-y border-stone">
          {cart.lines.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </div>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-24 rounded-card border border-stone bg-stone-soft/40 p-6">
          <h2 className="font-serif text-lg text-ink">Resumen</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(cart.cost.subtotalAmount)}</dd>
            </div>
            <div className="flex justify-between text-ink-soft">
              <dt>Envío</dt>
              <dd>Calculado en checkout</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-stone pt-4 text-base font-medium text-ink">
            <span>Total estimado</span>
            <span className="tabular-nums">{formatPrice(cart.cost.totalAmount)}</span>
          </div>

          {error && <p className="mt-3 text-sm text-danger">{error}</p>}

          <a
            href={cart.checkoutUrl}
            onClick={() => trackBeginCheckout(cart)}
            className={`mt-6 flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent-dark ${
              isUpdating ? "pointer-events-none opacity-70" : ""
            }`}
          >
            Finalizar compra
          </a>
          <p className="mt-3 text-center text-xs text-ink-soft/70">
            Checkout seguro alojado por Shopify.
          </p>
        </div>
      </aside>
    </div>
  );
}
