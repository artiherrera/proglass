import { STATS } from "@/lib/content";

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-5xl font-extrabold text-accent sm:text-6xl">
              {s.value}
            </p>
            <p className="mx-auto mt-2 max-w-[14rem] text-sm text-ink-soft">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
