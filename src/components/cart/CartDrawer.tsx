"use client";

import { ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";

import { CartLineItem } from "@/components/cart/CartLineItem";
import { useCart } from "@/components/cart/cart-context";
import { trackBeginCheckout } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { cart, isOpen, closeCart, totalQuantity, isUpdating, error } = useCart();

  // Lock body scroll while the drawer is open + close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Carrito de compra"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-stone px-6 py-4">
          <h2 className="font-serif text-lg">
            Tu carrito{totalQuantity > 0 && ` (${totalQuantity})`}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-ink-soft hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-stone" strokeWidth={1.25} />
            <p className="font-serif text-lg">Tu carrito está vacío</p>
            <p className="text-sm text-ink-soft">
              Explora el catálogo y añade tus favoritos.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:bg-ink-soft"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-stone overflow-y-auto px-6">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} onNavigate={closeCart} />
              ))}
            </div>

            <footer className="border-t border-stone px-6 py-5">
              {error && <p className="mb-3 text-sm text-danger">{error}</p>}
              <div className="mb-1 flex justify-between text-sm text-ink-soft">
                <span>Subtotal</span>
                <span className="tabular-nums">
                  {formatPrice(cart.cost.subtotalAmount)}
                </span>
              </div>
              <p className="mb-4 text-xs text-ink-soft/70">
                Impuestos y envío se calculan en el checkout.
              </p>
              <a
                href={cart.checkoutUrl}
                onClick={() => trackBeginCheckout(cart)}
                className={`flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent-dark ${
                  isUpdating ? "pointer-events-none opacity-70" : ""
                }`}
              >
                Finalizar compra
              </a>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
