import Link from "next/link";

import { BRAND } from "@/lib/constants";

// Hero oscuro con glow azul (firma visual del manual §10).
// Para contenido editable, conéctalo a un metaobject "Hero" de Shopify.
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      {/* Glow azul ProGlass */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-10%,rgba(11,95,230,0.55),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <span className="rounded-full border border-paper/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
          {BRAND.madeIn}
        </span>
        <h1 className="max-w-3xl font-display text-4xl font-extrabold uppercase italic leading-[1.05] sm:text-6xl lg:text-7xl">
          {BRAND.tagline}
        </h1>
        <p className="max-w-xl text-base text-paper/70 sm:text-lg">
          Limpia, protege y conserva tu calzado, lentes y más — con estándar
          profesional y resultados que se notan desde el primer uso.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/collections"
            className="rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-accent-dark"
          >
            Ver productos
          </Link>
          <Link
            href="/collections/mas-vendidos"
            className="rounded-xl border border-paper/30 px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
          >
            Más vendidos
          </Link>
        </div>
      </div>
    </section>
  );
}
