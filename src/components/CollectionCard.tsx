import Image from "next/image";
import Link from "next/link";

import type { Collection } from "@/lib/shopify/types";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/collections/${collection.handle}`}
      className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-card bg-stone-soft"
    >
      {collection.image ? (
        <Image
          src={collection.image.url}
          alt={collection.image.altText || collection.title}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ink/80 to-ink-soft/60" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      <div className="relative z-10 p-5">
        <h3 className="font-display text-xl uppercase text-paper">
          {collection.title}
        </h3>
        <span className="text-sm text-paper/80 group-hover:text-paper">
          Explorar →
        </span>
      </div>
    </Link>
  );
}
