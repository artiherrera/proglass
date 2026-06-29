"use client";

import { useEffect, useRef } from "react";

// Video de fondo del Hero. `src`/`poster` vienen del metaobjeto de Shopify;
// si no hay, cae a los archivos de /public, y si tampoco, al fondo Ink.
// Fuerza muted + play() para autoplay confiable.
export function HeroVideo({
  src,
  poster,
}: {
  src?: string | null;
  poster?: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      /* algunos navegadores bloquean autoplay; se queda el poster */
    });
  }, [src]);

  return (
    <video
      key={src ?? "fallback"}
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster ?? "/hero-poster.jpg"}
      aria-hidden
    >
      {src ? (
        <source src={src} />
      ) : (
        <>
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4" type="video/mp4" />
        </>
      )}
    </video>
  );
}
