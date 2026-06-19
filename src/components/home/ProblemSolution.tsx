import { ArrowRight, Check, X } from "lucide-react";

import { PROBLEMS } from "@/lib/content";

export function ProblemSolution() {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">
            De problema a solución
          </h2>
          <p className="mt-2 text-ink-soft">
            Cada producto resuelve algo concreto.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div
              key={p.problem}
              className="flex flex-col rounded-card border border-stone bg-paper p-6"
            >
              <p className="flex items-start gap-2 text-sm font-medium text-ink-soft">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" strokeWidth={2} />
                {p.problem}
              </p>
              <ArrowRight className="my-4 h-5 w-5 text-stone" strokeWidth={1.5} />
              <p className="flex items-start gap-2 text-sm font-semibold text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" strokeWidth={2} />
                {p.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
