import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export — required for AWS Amplify static hosting.
  // No SSR/ISR/Route Handlers at runtime; the catalog is pre-rendered at
  // build time and refreshed by a Shopify webhook that re-triggers a build.
  output: "export",

  // Folder-style URLs (/products/foo/index.html) so any static host serves
  // them without custom rewrite rules.
  trailingSlash: true,

  images: {
    // Amplify static hosting has no Next.js image optimizer.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
