"use client";

import { useEffect, useRef } from "react";

// Video de fondo del Hero. Fuerza muted + play() en el cliente para que el
// autoplay funcione de forma confiable (evita la peculiaridad de React con
// el atributo `muted`). Degrada al poster / fondo Ink si no hay archivo.
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      /* algunos navegadores bloquean autoplay; se queda el poster */
    });
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/hero-poster.jpg"
      aria-hidden
    >
      <source src="/hero.webm" type="video/webm" />
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
}
