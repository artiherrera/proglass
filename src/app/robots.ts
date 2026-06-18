import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";

// Required so the route is emitted as a static file under `output: export`.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
