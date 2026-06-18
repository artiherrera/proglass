import { BRAND } from "@/lib/constants";

// Cintillo superior en movimiento (marquee). Más grande y con varios mensajes.
const MESSAGES = [
  BRAND.announcement,
  "Cuidado premium para tu día a día",
  "Resultados desde el primer uso",
];

export function AnnouncementBar() {
  // Dos copias del set para que el desplazamiento -50% haga un loop continuo.
  const track = [...MESSAGES, ...MESSAGES];

  return (
    <div className="overflow-hidden border-b border-white/10 bg-ink py-3.5 text-paper">
      <div className="animate-marquee flex w-max whitespace-nowrap will-change-transform">
        {track.map((message, i) => (
          <span
            key={i}
            className="mx-6 flex items-center gap-6 text-base font-semibold uppercase tracking-wide sm:text-lg"
          >
            {message}
            <span className="text-accent" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
