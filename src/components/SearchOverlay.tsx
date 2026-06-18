"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { getProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";

// Búsqueda en vivo contra la Storefront API desde el cliente (token público).
export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Cerrar con Escape + bloquear scroll del body.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Buscar con debounce.
  useEffect(() => {
    if (!term.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = setTimeout(() => {
      getProducts({ query: term, first: 8 })
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(id);
  }, [term]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-0 bg-paper shadow-xl">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 border-b border-stone pb-3">
            <Search className="h-5 w-5 shrink-0 text-ink-soft" strokeWidth={1.5} />
            <input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Buscar productos…"
              aria-label="Buscar productos"
              className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft/50"
            />
            <button type="button" onClick={onClose} aria-label="Cerrar búsqueda">
              <X className="h-5 w-5 text-ink-soft hover:text-ink" strokeWidth={1.5} />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-2">
            {loading && (
              <p className="py-8 text-center text-sm text-ink-soft">Buscando…</p>
            )}
            {!loading && term.trim() && results.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-soft">
                Sin resultados para “{term}”.
              </p>
            )}
            {!loading && !term.trim() && (
              <p className="py-8 text-center text-sm text-ink-soft/70">
                Escribe para buscar en el catálogo.
              </p>
            )}
            <ul className="divide-y divide-stone">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.handle}`}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-lg px-2 py-3 hover:bg-surface"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-surface">
                      {p.featuredImage && (
                        <Image
                          src={p.featuredImage.url}
                          alt={p.featuredImage.altText}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{p.title}</p>
                      <p className="text-sm text-ink-soft">
                        {formatPrice(p.priceRange.minVariantPrice)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
