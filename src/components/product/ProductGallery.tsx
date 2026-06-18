"use client";

import Image from "next/image";

import type { ShopifyImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  activeIndex,
  onSelect,
  title,
}: {
  images: ShopifyImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
  title: string;
}) {
  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-card bg-stone-soft text-ink-soft/40">
        Sin imagen
      </div>
    );
  }

  const active = images[Math.min(activeIndex, images.length - 1)];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-card bg-stone-soft">
        <Image
          src={active.url}
          alt={active.altText || title}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === activeIndex}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-md bg-stone-soft ring-2 transition",
                i === activeIndex ? "ring-accent" : "ring-transparent hover:ring-stone",
              )}
            >
              <Image
                src={image.url}
                alt={image.altText || `${title} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
