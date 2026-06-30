"use client";

import { useCallback, useRef, useState } from "react";
import { Play } from "lucide-react";

// Video vertical (estilo reel, 9:16) CON audio. No hace autoplay: muestra el
// póster con un botón de play; al tocar reproduce CON sonido desde el inicio.
// Tocar el video lo pausa/reanuda; al terminar reaparece el botón para repetir.
// (Los navegadores no permiten autoplay con sonido, por eso es clic-para-sonar.)
export function VerticalVideo({
  src,
  poster,
}: {
  src: string;
  poster?: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Botón de play: arranca con sonido. Si ya terminó, reinicia desde 0.
  const start = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    if (video.ended) video.currentTime = 0;
    video.muted = false;
    const p = video.play();
    if (p) p.then(() => setPlaying(true)).catch(() => {});
  }, []);

  // Tocar el video mientras corre: pausa.
  const togglePause = useCallback(() => {
    const video = ref.current;
    if (!video || video.paused) return;
    video.pause();
  }, []);

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-2xl bg-ink shadow-lg ring-1 ring-stone">
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        preload="metadata"
        poster={poster ?? undefined}
        onClick={togglePause}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Overlay con botón de play; visible mientras está pausado/idle/terminado */}
      {!playing && (
        <button
          type="button"
          onClick={start}
          aria-label="Reproducir video con sonido"
          className="group absolute inset-0 grid place-items-center bg-ink/30 transition-colors hover:bg-ink/40"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-paper/90 text-ink shadow-lg transition-transform group-hover:scale-105">
            <Play className="h-7 w-7 translate-x-0.5 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
