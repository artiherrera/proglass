import { SOCIAL } from "@/lib/constants";

export function HelpBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-5 rounded-card bg-accent px-8 py-10 text-center text-paper sm:flex-row sm:text-left">
        <div>
          <h2 className="font-serif text-2xl">¿No sabes qué producto elegir?</h2>
          <p className="mt-1 text-paper/85">
            Contáctanos y te ayudamos a encontrar el cuidado ideal.
          </p>
        </div>
        <a
          href={SOCIAL.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-xl bg-paper px-7 py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-paper/90"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </section>
  );
}
