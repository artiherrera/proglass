import Link from "next/link";
import { Check } from "lucide-react";

import { BeforeAfter } from "@/components/BeforeAfter";
import { DEFAULT_BEFORE_AFTER, RESULT_BENEFITS } from "@/lib/content";

export function ResultsShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            La diferencia ProGlass
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold uppercase italic text-ink sm:text-4xl">
            Resultados que se ven
          </h2>
          <p className="mt-4 text-ink-soft">
            Arrastra el divisor y mira la transformación. Limpieza y protección
            de nivel profesional, desde casa.
          </p>
          <ul className="mt-6 space-y-3">
            {RESULT_BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-ink">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-accent">
                  <Check className="h-4 w-4" strokeWidth={2} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <Link
            href="/collections/mas-vendidos"
            className="mt-8 inline-flex rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-accent-dark"
          >
            Ver productos
          </Link>
        </div>

        <BeforeAfter
          before={DEFAULT_BEFORE_AFTER.before}
          after={DEFAULT_BEFORE_AFTER.after}
        />
      </div>
    </section>
  );
}
