"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-context";
import { BRAND, MAIN_NAV } from "@/lib/constants";

export function Header() {
  const { totalQuantity, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center md:hidden"
        >
          <span className="text-xl">{menuOpen ? "×" : "≡"}</span>
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink md:flex-none"
        >
          {BRAND.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Cart */}
        <button
          type="button"
          onClick={openCart}
          aria-label={`Abrir carrito, ${totalQuantity} artículos`}
          className="relative flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-ink hover:bg-stone-soft"
        >
          <span>Carrito</span>
          {totalQuantity > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-paper tabular-nums">
              {totalQuantity}
            </span>
          )}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="border-t border-stone bg-paper md:hidden">
          <ul className="flex flex-col px-4 py-2">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-base font-medium text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
