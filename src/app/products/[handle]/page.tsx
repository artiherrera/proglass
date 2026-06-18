import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/ProductGrid";
import { ProductView } from "@/components/product/ProductView";
import { BRAND, SITE_URL } from "@/lib/constants";
import {
  getAllProductHandles,
  getProduct,
  getProductRecommendations,
} from "@/lib/shopify";

// Static export: every product page is pre-rendered at build time and
// unknown handles 404 (no on-demand rendering).
export const dynamicParams = false;

export async function generateStaticParams() {
  const handles = await getAllProductHandles();
  // `output: export` rejects a dynamic route with zero params. Emit a
  // placeholder (which 404s) so the project builds before Shopify is
  // connected; real handles replace it on the next build.
  if (handles.length === 0) return [{ handle: "_" }];
  return handles.map(({ handle }) => ({ handle }));
}

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Producto no encontrado" };

  const title = product.seo.title || product.title;
  const description =
    product.seo.description || product.description.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: product.featuredImage
        ? [{ url: product.featuredImage.url }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const recommendations = await getProductRecommendations(product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: product.vendor || BRAND.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.handle}`,
    },
    ...(product.rating != null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.ratingCount ?? 0,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Inicio
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <ProductView product={product} />

      {recommendations.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-serif text-2xl text-ink">También te puede gustar</h2>
          <ProductGrid products={recommendations.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
