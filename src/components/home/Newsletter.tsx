"use client";

import { useState } from "react";

import { klaviyoEvent } from "@/lib/analytics";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    // Se registra en Klaviyo si está configurado; si no, es no-op.
    klaviyoEvent("Newsletter Signup", { $email: email });
    setDone(true);
  }

  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-extrabold uppercase italic">
          Suscríbete
        </h2>
        <p className="mt-2 text-paper/70">
          Recibe lanzamientos y promociones antes que nadie.
        </p>

        {done ? (
          <p className="mt-6 font-medium text-blue-300">
            ¡Gracias! Te escribiremos pronto. 🎉
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              aria-label="Correo electrónico"
              className="flex-1 rounded-xl border border-paper/20 bg-white/5 px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent-dark"
            >
              Suscribirme
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
