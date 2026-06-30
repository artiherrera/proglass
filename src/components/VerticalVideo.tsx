"use client";

import { useCallback, useEffect, useRef } from "react";

// Video vertical contenido (estilo TikTok, 9:16). Autoplay robusto.
export function VerticalVideo({
  src,
  poster,
}: {
  src: string;
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
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-2xl bg-ink shadow-lg ring-1 ring-stone">
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
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
