import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/ProductGrid";
import {
  getAllCollectionHandles,
  getCollection,
  getCollectionProducts,
} from "@/lib/shopify";

export const dynamicParams = false;

export async function generateStaticParams() {
  const handles = await getAllCollectionHandles();
  // `output: export` rejects a dynamic route with zero params. Emit a
  // placeholder (which 404s) so the project builds before Shopify is
  // connected; real handles replace it on the next build.
  if (handles.length === 0) return [{ handle: "_" }];
  return handles.map(({ handle }) => ({ handle }));
}

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return { title: "Colección no encontrada" };

  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description.slice(0, 160),
    alternates: { canonical: `/collections/${collection.handle}` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts({ handle }),
  ]);

  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">{collection.title}</h1>
        {collection.description && (
          <p className="mt-3 text-ink-soft">{collection.description}</p>
        )}
        <p className="mt-4 text-sm text-ink-soft/60">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </p>
      </header>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-ink-soft">Esta colección aún no tiene productos.</p>
      )}
    </div>
  );
}
