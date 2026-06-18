import Link from "next/link";

import { CollectionCard } from "@/components/CollectionCard";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { SetupNotice } from "@/components/SetupNotice";
import { getCollections, getProducts, isShopifyConfigured } from "@/lib/shopify";

export default async function HomePage() {
  const [featured, collections] = await Promise.all([
    getProducts({ first: 8, sortKey: "BEST_SELLING" }),
    getCollections(6),
  ]);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">Destacados</h2>
          <Link
            href="/collections"
            className="text-sm font-medium text-accent hover:text-accent-dark"
          >
            Ver todo →
          </Link>
        </div>

        {featured.length > 0 ? (
          <ProductGrid products={featured} />
        ) : isShopifyConfigured ? (
          <p className="text-ink-soft">Aún no hay productos publicados.</p>
        ) : (
          <SetupNotice />
        )}
      </section>

      {collections.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-serif text-2xl text-ink sm:text-3xl">
            Colecciones
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
