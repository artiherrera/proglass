"use client";

import { useCallback, useEffect, useRef } from "react";

// Video de fondo del Hero. `src`/`poster` vienen del metaobjeto de Shopify.
// Autoplay robusto + bucle infinito auto-reanudable: fuerza muted + reintenta
// play() en carga, al pausarse (el navegador lo pausa al cambiar de pestaña /
// bajo consumo / stall de buffer) y al volver la pestaña a primer plano. Como
// es decorativo (aria-hidden, sin controles) el usuario nunca lo pausa, así
// que reanudar siempre es seguro y mantiene el loop realmente infinito.
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
    const onVisible = () => {
      if (document.visibilityState === "visible") play();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
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
      onPause={play}
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
