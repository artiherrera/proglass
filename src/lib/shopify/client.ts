// Low-level fetch wrapper for the Shopify Storefront GraphQL API.
//
// Works in two contexts:
//   1. Server Components at BUILD TIME (static export) — reads the
//      non-public env vars.
//   2. The browser at runtime (cart mutations) — falls back to the
//      NEXT_PUBLIC_* vars, which Next.js inlines into the client bundle.
//
// Because both references are literal `process.env.NEXT_PUBLIC_*` member
// accesses, Next replaces them at build time and the client always has a
// working domain/token (the Storefront token is read-only and public-safe).

const DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN ??
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ??
  "";

const TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ??
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ??
  "";

const API_VERSION =
  process.env.SHOPIFY_API_VERSION ??
  process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ??
  "2025-01";

/** True when a domain + token are present so we can actually call Shopify. */
export const isShopifyConfigured = Boolean(DOMAIN && TOKEN);

const ENDPOINT = DOMAIN
  ? `https://${DOMAIN}/api/${API_VERSION}/graphql.json`
  : "";

export class ShopifyError extends Error {
  status?: number;
  query?: string;
  constructor(message: string, opts?: { status?: number; query?: string }) {
    super(message);
    this.name = "ShopifyError";
    this.status = opts?.status;
    this.query = opts?.query;
  }
}

type ShopifyFetchArgs = {
  query: string;
  variables?: Record<string, unknown>;
  /** Defaults to "force-cache" so build-time reads are cached. */
  cache?: RequestCache;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function shopifyFetch<T>({
  query,
  variables,
  cache = "force-cache",
}: ShopifyFetchArgs): Promise<T> {
  if (!isShopifyConfigured) {
    throw new ShopifyError(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.",
    );
  }

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    });
  } catch (err) {
    throw new ShopifyError(
      `Network error calling Shopify: ${(err as Error).message}`,
      { query },
    );
  }

  if (!res.ok) {
    throw new ShopifyError(`Shopify responded ${res.status}`, {
      status: res.status,
      query,
    });
  }

  const body = (await res.json()) as GraphQLResponse<T>;

  if (body.errors?.length) {
    throw new ShopifyError(body.errors.map((e) => e.message).join("; "), {
      query,
    });
  }

  if (!body.data) {
    throw new ShopifyError("Shopify returned no data", { query });
  }

  return body.data;
}
