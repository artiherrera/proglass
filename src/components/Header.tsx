"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

import { SearchOverlay } from "@/components/SearchOverlay";
import { useCart } from "@/components/cart/cart-context";
import { BRAND, MAIN_NAV } from "@/lib/constants";

const ACCOUNT_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/account`;

export function Header() {
  const { totalQuantity, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
        >
          {menuOpen ? (
            <X className="h-6 w-6" strokeWidth={1.5} />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          )}
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

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-stone-soft"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <a
            href={ACCOUNT_URL}
            aria-label="Mi cuenta"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-stone-soft sm:flex"
          >
            <User className="h-5 w-5" strokeWidth={1.5} />
          </a>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrito, ${totalQuantity} artículos`}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-stone-soft"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {totalQuantity > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-paper tabular-nums">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
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
            <li>
              <a
                href={ACCOUNT_URL}
                className="block py-3 text-base font-medium text-ink"
              >
                Mi cuenta
              </a>
            </li>
          </ul>
        </nav>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
