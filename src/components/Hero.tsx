import Link from "next/link";

import { BRAND } from "@/lib/constants";

// Static hero. For editable content, wire this to a Shopify "Hero Slide"
// metaobject and pass the fields in as props.
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-stone bg-ink text-paper">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <span className="text-xs uppercase tracking-[0.2em] text-paper/60">
          {BRAND.name}
        </span>
        <h1 className="max-w-3xl font-display text-4xl uppercase leading-[1.05] sm:text-6xl lg:text-7xl">
          {BRAND.tagline}
        </h1>
        <p className="max-w-xl text-base text-paper/70 sm:text-lg">
          Monturas de precisión, lentes de alto rendimiento y un acabado que dura.
          Diseño headless, envío a todo el país.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/collections"
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent-dark"
          >
            Ver colecciones
          </Link>
          <Link
            href="/collections/novedades"
            className="rounded-full border border-paper/30 px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-paper/10"
          >
            Novedades
          </Link>
        </div>
      </div>
    </section>
  );
}
