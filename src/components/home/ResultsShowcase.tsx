import Link from "next/link";

import { BeforeAfter } from "@/components/BeforeAfter";
import { RESULTS } from "@/lib/content";

export function ResultsShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          La diferencia ProGlass
        </span>
        <h2 className="mt-2 font-display text-3xl font-extrabold uppercase italic text-ink sm:text-4xl">
          Resultados que se ven
        </h2>
        <p className="mt-3 text-ink-soft">
          Arrastra el divisor en cada caso y mira la transformación.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {RESULTS.map((r) => (
          <figure key={r.title}>
            <BeforeAfter before={r.before} after={r.after} alt={r.title} />
            <figcaption className="mt-3 text-center text-sm font-medium text-ink">
              {r.title}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/collections/mas-vendidos"
          className="inline-flex rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-accent-dark"
        >
          Ver productos
        </Link>
      </div>
    </section>
  );
}
