"use client";

import { useEffect, useRef } from "react";

// Video vertical contenido (estilo TikTok, 9:16). Autoplay muted loop con
// play() forzado para reproducción confiable.
export function VerticalVideo({
  src,
  poster,
}: {
  src: string;
  poster?: string | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [src]);

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-2xl bg-ink shadow-lg ring-1 ring-stone">
      <video
        key={src}
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster ?? undefined}
      >
        <source src={src} />
      </video>
    </div>
  );
}
