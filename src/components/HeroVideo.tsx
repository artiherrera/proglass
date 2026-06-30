"use client";

import { useCallback, useEffect, useRef } from "react";

// Video de fondo del Hero. `src`/`poster` vienen del metaobjeto de Shopify.
// Autoplay a prueba de balas + bucle infinito:
//  - callback ref: aplica muted/defaultMuted e intenta play() apenas existe el
//    nodo (antes de useEffect) para ganar la carrera de hidratación de React
//    con `muted`, que es la causa típica de que el navegador bloquee el autoplay.
//  - reintenta al cargar, al pausarse y al volver la pestaña a primer plano.
//  - fallback universal: si el navegador bloquea el autoplay duro (iOS Modo
//    Bajo Consumo, "Auto-Play: Never"), el PRIMER gesto (tap/scroll/tecla) lo
//    arranca. El botón de play nativo de WebKit se oculta vía CSS (.hero-video).
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

  // Callback ref: corre en el commit (antes de useEffect), así muted ya está
  // aplicado cuando el navegador evalúa el autoplay tras la hidratación.
  const setRef = useCallback((node: HTMLVideoElement | null) => {
    ref.current = node;
    if (!node) return;
    node.muted = true;
    node.defaultMuted = true;
    const p = node.play();
    if (p) p.catch(() => {});
  }, []);

  useEffect(() => {
    play();

    const onVisible = () => {
      if (document.visibilityState === "visible") play();
    };
    document.addEventListener("visibilitychange", onVisible);

    // Fallback: si el autoplay quedó bloqueado, el primer gesto del usuario
    // (en cualquier parte de la página) arranca el video. Se auto-remueve.
    const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;
    const removeKick = () =>
      events.forEach((e) => window.removeEventListener(e, kick));
    const kick = () => {
      play();
      removeKick();
    };
    events.forEach((e) =>
      window.addEventListener(e, kick, { once: true, passive: true }),
    );

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      removeKick();
    };
  }, [play, src]);

  return (
    <video
      ref={setRef}
      className="hero-video absolute inset-0 h-full w-full object-cover"
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
