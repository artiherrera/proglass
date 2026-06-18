import type { Metadata } from "next";

import { CollectionCard } from "@/components/CollectionCard";
import { SetupNotice } from "@/components/SetupNotice";
import { getCollections, isShopifyConfigured } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Colecciones",
  description: "Explora todas las colecciones.",
};

export default async function CollectionsPage() {
  const collections = await getCollections(50);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-3xl text-ink">Colecciones</h1>

      {collections.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : isShopifyConfigured ? (
        <p className="text-ink-soft">Aún no hay colecciones publicadas.</p>
      ) : (
        <SetupNotice />
      )}
    </div>
  );
}
