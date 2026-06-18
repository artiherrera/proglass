import { TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-serif text-2xl text-ink sm:text-3xl">
          Lo que dicen nuestros clientes
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-card border border-stone bg-paper p-6"
            >
              <div aria-label={`${t.rating} de 5 estrellas`}>
                <span className="text-accent">{"★".repeat(t.rating)}</span>
                <span className="text-stone">{"★".repeat(5 - t.rating)}</span>
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-ink">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
