import type { MetadataRoute } from "next";

import { KNOWN_COLLECTIONS, SITE_URL } from "@/lib/constants";
import { STATIC_PAGE_HANDLES } from "@/lib/content";
import {
  getAllCollectionHandles,
  getAllPageHandles,
  getAllProductHandles,
} from "@/lib/shopify";

// Required so the route is emitted as a static file under `output: export`.
export const dynamic = "force-static";

// Generated at build time into /sitemap.xml (works with static export).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, pages] = await Promise.all([
    getAllProductHandles(),
    getAllCollectionHandles(),
    getAllPageHandles(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/collections`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map(({ handle, updatedAt }) => ({
    url: `${SITE_URL}/products/${handle}`,
    lastModified: updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Colecciones reales + categorías esperadas del manual (deduplicadas).
  const collectionHandles = Array.from(
    new Set([
      ...collections.map((c) => c.handle),
      ...KNOWN_COLLECTIONS.map((c) => c.handle),
    ]),
  );
  const collectionRoutes: MetadataRoute.Sitemap = collectionHandles.map((handle) => ({
    url: `${SITE_URL}/collections/${handle}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Páginas de contenido (Shopify + estáticas por defecto, deduplicadas).
  const pageHandles = Array.from(
    new Set([...pages.map((p) => p.handle), ...STATIC_PAGE_HANDLES]),
  );
  const pageRoutes: MetadataRoute.Sitemap = pageHandles.map((handle) => ({
    url: `${SITE_URL}/pages/${handle}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...collectionRoutes,
    ...pageRoutes,
  ];
}
