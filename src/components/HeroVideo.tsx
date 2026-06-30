"use client";

import { useCallback, useEffect, useRef } from "react";

// Video de fondo del Hero. `src`/`poster` vienen del metaobjeto de Shopify.
// Autoplay robusto: fuerza muted + reintenta play() en varios eventos
// (evita bloqueos de autoplay y la peculiaridad de React con `muted`).
export function HeroVideo({
  src,
  poster,
}: {
  src?: string | null;
  poster?: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  const play = useCallback(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const p = video.play();
    if (p) p.catch(() => {});
  }, []);

  useEffect(() => {
    play();
  }, [play, src]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster ?? undefined}
      onLoadedData={play}
      onCanPlay={play}
      aria-hidden
    >
      {src ? (
        <source src={src} type="video/mp4" />
      ) : (
        <>
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4" type="video/mp4" />
        </>
      )}
    </video>
  );
}
