import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/ProductGrid";
import { KNOWN_COLLECTIONS } from "@/lib/constants";
import {
  getAllCollectionHandles,
  getCollection,
  getCollectionProducts,
  getProducts,
} from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";

export const dynamicParams = false;

const MAS_VENDIDOS = "mas-vendidos";

export async function generateStaticParams() {
  const real = (await getAllCollectionHandles()).map((c) => c.handle);
  // Une las colecciones reales con las categorías esperadas del manual, así
  // la nav resuelve aunque la colección aún no exista en Shopify.
  const handles = Array.from(
    new Set([...real, ...KNOWN_COLLECTIONS.map((c) => c.handle)]),
  );
  return handles.map((handle) => ({ handle }));
}

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  if (handle === MAS_VENDIDOS) {
    return {
      title: "Más vendidos",
      description: "Los productos favoritos de nuestros clientes.",
      alternates: { canonical: `/collections/${MAS_VENDIDOS}` },
    };
  }
  const collection = await getCollection(handle);
  const known = KNOWN_COLLECTIONS.find((c) => c.handle === handle);
  const title = collection?.seo.title || collection?.title || known?.title;
  if (!title) return { title: "Colección no encontrada" };

  return {
    title,
    description:
      collection?.seo.description || collection?.description.slice(0, 160) || undefined,
    alternates: { canonical: `/collections/${handle}` },
  };
}

function CollectionView({
  title,
  description,
  products,
}: {
  title: string;
  description?: string;
  products: Product[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-ink-soft">{description}</p>}
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

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
        Próximamente
      </span>
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="text-ink-soft">
        Estamos preparando esta colección. Mientras tanto, descubre nuestros
        productos más vendidos.
      </p>
      <Link
        href="/collections/mas-vendidos"
        className="mt-2 rounded-xl bg-accent px-7 py-3 text-sm font-semibold text-paper hover:bg-accent-dark"
      >
        Ver más vendidos
      </Link>
    </div>
  );
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;

  // "Más vendidos" es una colección virtual: todos los productos por ventas.
  if (handle === MAS_VENDIDOS) {
    const products = await getProducts({ first: 48, sortKey: "BEST_SELLING" });
    return (
      <CollectionView
        title="Más vendidos"
        description="Los favoritos de nuestros clientes."
        products={products}
      />
    );
  }

  const [collection, products] = await Promise.all([
    getCollection(handle),
    getCollectionProducts({ handle }),
  ]);

  if (!collection) {
    // Categoría esperada que todavía no existe en Shopify → "próximamente".
    const known = KNOWN_COLLECTIONS.find((c) => c.handle === handle);
    if (known) return <ComingSoon title={known.title} />;
    notFound();
  }

  return (
    <CollectionView
      title={collection.title}
      description={collection.description}
      products={products}
    />
  );
}
