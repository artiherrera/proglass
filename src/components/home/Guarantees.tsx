import { Icon } from "@/components/Icon";
import { GUARANTEES } from "@/lib/content";

export function Guarantees() {
  return (
    <section className="border-b border-stone bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {GUARANTEES.map((g) => (
          <div key={g.title} className="flex items-center gap-3">
            <Icon name={g.icon} className="h-7 w-7 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold text-ink">{g.title}</p>
              <p className="text-xs text-ink-soft">{g.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
