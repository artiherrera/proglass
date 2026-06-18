import Link from "next/link";

// Categorías de la marca (manual §2). Sin imagen aún → degradado por acento.
const CATEGORIES = [
  {
    handle: "calzado",
    title: "Calzado",
    subtitle: "Limpieza y protección para tus tenis y zapatos.",
    color: "var(--color-sneakers)",
  },
  {
    handle: "visual",
    title: "Visual",
    subtitle: "Cuidado profesional para tus lentes.",
    color: "var(--color-vision)",
  },
  {
    handle: "personal",
    title: "Personal",
    subtitle: "Cuidado personal premium.",
    color: "var(--color-soft)",
  },
];

export function CategoryCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="font-serif text-2xl text-ink sm:text-3xl">
          Especialistas en cuidado premium
        </h2>
        <p className="mt-2 text-ink-soft">Encuentra el cuidado ideal por categoría.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.handle}
            href={`/collections/${c.handle}`}
            className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-card p-6 text-paper transition-transform hover:-translate-y-1"
            style={{
              backgroundImage: `linear-gradient(160deg, ${c.color} 0%, var(--color-ink) 85%)`,
            }}
          >
            <h3 className="font-display text-2xl font-extrabold uppercase">
              {c.title}
            </h3>
            <p className="mt-1 max-w-[14rem] text-sm text-paper/85">{c.subtitle}</p>
            <span className="mt-3 text-sm font-semibold">Explorar →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
