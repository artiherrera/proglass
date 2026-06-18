import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { getAllCollectionHandles, getAllProductHandles } from "@/lib/shopify";

// Required so the route is emitted as a static file under `output: export`.
export const dynamic = "force-static";

// Generated at build time into /sitemap.xml (works with static export).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getAllProductHandles(),
    getAllCollectionHandles(),
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

  const collectionRoutes: MetadataRoute.Sitemap = collections.map(
    ({ handle, updatedAt }) => ({
      url: `${SITE_URL}/collections/${handle}`,
      lastModified: updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
