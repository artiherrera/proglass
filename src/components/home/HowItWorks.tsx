import { STEPS } from "@/lib/content";

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-10 text-center font-serif text-2xl text-ink sm:text-3xl">
        Cómo funciona
      </h2>
      <div className="grid gap-8 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent font-display text-xl font-extrabold text-paper">
              {s.n}
            </span>
            <h3 className="mt-4 font-serif text-lg text-ink">{s.title}</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
