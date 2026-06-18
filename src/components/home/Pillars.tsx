import { PILLARS } from "@/lib/content";

export function Pillars() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
            Por qué ProGlass
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold uppercase italic sm:text-4xl">
            Marca #1 en cuidado premium
          </h2>
          <p className="mt-3 text-paper/70">
            Resultados que se notan desde el primer uso.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="rounded-card border border-paper/10 bg-white/5 p-5 text-center"
            >
              <span className="text-3xl" aria-hidden>
                {p.icon}
              </span>
              <h3 className="mt-3 font-serif text-base">{p.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-paper/60">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
