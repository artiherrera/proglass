"use client";

import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";

// Comparador antes/después con divisor arrastrable (pointer + teclado).
export function BeforeAfter({
  before,
  after,
  beforeLabel = "Antes",
  afterLabel = "Después",
  alt = "Comparación antes y después",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-card bg-surface"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      {/* DESPUÉS (base) */}
      <Image
        src={after}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-paper">
        {afterLabel}
      </span>

      {/* ANTES (recortado encima según la posición) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={before}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-paper">
          {beforeLabel}
        </span>
      </div>

      {/* Divisor */}
      <div
        className="pointer-events-none absolute inset-y-0 w-1 bg-paper/90"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      />

      {/* Manija */}
      <button
        type="button"
        role="slider"
        aria-label="Comparar antes y después"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
        }}
        className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-lg ring-1 ring-ink/10"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
