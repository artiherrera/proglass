import Link from "next/link";

import { HeroVideo } from "@/components/HeroVideo";
import { BRAND } from "@/lib/constants";

// Hero con video de fondo + scrim oscuro (degradado) + glow azul para
// legibilidad. Degrada a fondo Ink si el video/poster aún no existen.
// Coloca los archivos en /public: hero.mp4, hero.webm (opcional), hero-poster.jpg
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      {/* Video de fondo */}
      <HeroVideo />

      {/* Scrim: oscuro del lado del texto → más claro del otro (deja ver el video) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40"
      />
      {/* Glow azul de marca */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_-10%,rgba(11,95,230,0.35),transparent_70%)]"
      />

      {/* Contenido */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <span className="rounded-full border border-paper/20 bg-ink/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300 backdrop-blur-sm">
          {BRAND.madeIn}
        </span>
        <h1 className="max-w-3xl font-display text-4xl font-extrabold uppercase italic leading-[1.05] drop-shadow-sm sm:text-6xl lg:text-7xl">
          {BRAND.tagline}
        </h1>
        <p className="max-w-xl text-base text-paper/80 sm:text-lg">
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
            className="rounded-xl border border-paper/30 bg-ink/20 px-7 py-3.5 text-sm font-semibold text-paper backdrop-blur-sm transition-colors hover:bg-paper/10"
          >
            Más vendidos
          </Link>
        </div>
      </div>
    </section>
  );
}
