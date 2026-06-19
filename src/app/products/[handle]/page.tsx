import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { BeforeAfter } from "@/components/BeforeAfter";
import { ProductGrid } from "@/components/ProductGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProductView } from "@/components/product/ProductView";
import { BRAND, SITE_URL } from "@/lib/constants";
import { DEFAULT_BEFORE_AFTER, RESULT_BENEFITS } from "@/lib/content";
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

      {/* Vende el resultado: comparador antes/después */}
      <section className="mt-20 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            La diferencia ProGlass
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold uppercase italic text-ink sm:text-3xl">
            Mira la diferencia
          </h2>
          <p className="mt-3 text-ink-soft">
            Arrastra el divisor para ver el antes y después.
          </p>
          <ul className="mt-6 space-y-3">
            {RESULT_BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-ink">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-accent">
                  <Check className="h-4 w-4" strokeWidth={2} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <BeforeAfter
          before={product.beforeAfter?.before ?? DEFAULT_BEFORE_AFTER.before}
          after={product.beforeAfter?.after ?? DEFAULT_BEFORE_AFTER.after}
          alt={product.title}
        />
      </section>

      <div className="mt-8 border-t border-stone">
        <HowItWorks />
      </div>

      {recommendations.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-serif text-2xl text-ink">También te puede gustar</h2>
          <ProductGrid products={recommendations.slice(0, 4)} />
        </section>
      )}
    </div>
  );
}
