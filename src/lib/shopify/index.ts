// Public data-access layer. Server Components and the cart provider call
// these functions; they handle reshaping raw Shopify connections into the
// clean domain types in `./types` and degrade gracefully when Shopify is
// not yet configured (so the project builds + runs without credentials).

import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  ADD_TO_CART,
  CREATE_CART,
  REMOVE_FROM_CART,
  UPDATE_CART,
} from "./mutations";
import {
  GET_ALL_COLLECTION_HANDLES,
  GET_ALL_PAGE_HANDLES,
  GET_ALL_PRODUCT_HANDLES,
  GET_CART,
  GET_COLLECTION_BY_HANDLE,
  GET_COLLECTION_PRODUCTS,
  GET_COLLECTIONS,
  GET_PAGE_BY_HANDLE,
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCT_RECOMMENDATIONS,
  GET_HERO,
  GET_PRODUCTS,
  GET_RESULT_CASES,
} from "./queries";
import type {
  Cart,
  Collection,
  Connection,
  Hero,
  Page,
  Product,
  ResultCase,
  ShopifyCart,
  ShopifyCollection,
  ShopifyImage,
  ShopifyProduct,
} from "./types";

export { isShopifyConfigured, ShopifyError } from "./client";
export * from "./types";

// ---------------------------------------------------------------------------
// Reshape helpers
// ---------------------------------------------------------------------------

function flatten<T>(connection?: Connection<T>): T[] {
  return connection?.edges.map((edge) => edge.node) ?? [];
}

function reshapeImages(
  connection: Connection<ShopifyImage> | undefined,
  productTitle: string,
): ShopifyImage[] {
  return flatten(connection).map((image) => ({
    ...image,
    altText: image.altText || productTitle,
  }));
}

function parseRating(value: string | undefined | null): number | null {
  if (!value) return null;
  // Judge.me / Shopify rating metafields store JSON: {"value":"4.8",...}
  try {
    const parsed = JSON.parse(value) as { value?: string };
    const n = Number(parsed.value);
    return Number.isFinite(n) ? n : null;
  } catch {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
}

function reshapeProduct(product: ShopifyProduct | null | undefined): Product | null {
  if (!product) return null;

  const {
    images,
    variants,
    options,
    ratingMetafield,
    ratingCountMetafield,
    beforeImage,
    afterImage,
    ...rest
  } = product;

  const before = beforeImage?.reference?.image?.url;
  const after = afterImage?.reference?.image?.url;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: flatten(variants),
    options: options.map((option) => ({
      id: option.id,
      name: option.name,
      values: option.optionValues.map((v) => v.name),
    })),
    featuredImage: product.featuredImage
      ? {
          ...product.featuredImage,
          altText: product.featuredImage.altText || product.title,
        }
      : null,
    rating: parseRating(ratingMetafield?.value),
    ratingCount: ratingCountMetafield?.value
      ? Number.parseInt(ratingCountMetafield.value, 10) || null
      : null,
    beforeAfter: before && after ? { before, after } : null,
  };
}

function reshapeProducts(products: Array<ShopifyProduct>): Product[] {
  return products
    .map(reshapeProduct)
    .filter((p): p is Product => Boolean(p));
}

function reshapeCart(cart: ShopifyCart): Cart {
  return {
    ...cart,
    cost: {
      ...cart.cost,
      totalTaxAmount: cart.cost.totalTaxAmount ?? null,
    },
    lines: flatten(cart.lines),
  };
}

// ---------------------------------------------------------------------------
// Catalog reads (run at build time for static export)
// ---------------------------------------------------------------------------

export type ProductSortKey =
  | "RELEVANCE"
  | "BEST_SELLING"
  | "CREATED_AT"
  | "PRICE"
  | "TITLE";

export async function getProducts(options?: {
  first?: number;
  sortKey?: ProductSortKey;
  reverse?: boolean;
  query?: string;
}): Promise<Product[]> {
  if (!isShopifyConfigured) return [];
  const data = await shopifyFetch<{ products: Connection<ShopifyProduct> }>({
    query: GET_PRODUCTS,
    variables: {
      first: options?.first ?? 24,
      sortKey: options?.sortKey,
      reverse: options?.reverse,
      query: options?.query,
    },
  });
  return reshapeProducts(flatten(data.products));
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured) return null;
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle },
  });
  return reshapeProduct(data.product);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  if (!isShopifyConfigured) return [];
  const data = await shopifyFetch<{ productRecommendations: ShopifyProduct[] }>({
    query: GET_PRODUCT_RECOMMENDATIONS,
    variables: { productId },
  });
  return reshapeProducts(data.productRecommendations ?? []);
}

export async function getCollections(first = 50): Promise<Collection[]> {
  if (!isShopifyConfigured) return [];
  const data = await shopifyFetch<{ collections: Connection<ShopifyCollection> }>({
    query: GET_COLLECTIONS,
    variables: { first },
  });
  return flatten(data.collections);
}

export async function getCollection(handle: string): Promise<Collection | null> {
  if (!isShopifyConfigured) return null;
  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>({
    query: GET_COLLECTION_BY_HANDLE,
    variables: { handle },
  });
  return data.collection ?? null;
}

export async function getCollectionProducts(options: {
  handle: string;
  first?: number;
  sortKey?: "COLLECTION_DEFAULT" | "BEST_SELLING" | "CREATED" | "PRICE" | "TITLE";
  reverse?: boolean;
}): Promise<Product[]> {
  if (!isShopifyConfigured) return [];
  const data = await shopifyFetch<{
    collection: { products: Connection<ShopifyProduct> } | null;
  }>({
    query: GET_COLLECTION_PRODUCTS,
    variables: {
      handle: options.handle,
      first: options.first ?? 48,
      sortKey: options.sortKey,
      reverse: options.reverse,
    },
  });
  if (!data.collection) return [];
  return reshapeProducts(flatten(data.collection.products));
}

type HandleNode = { handle: string; updatedAt: string };
type HandlesData = Record<
  string,
  {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: Array<{ node: HandleNode }>;
  }
>;

// Paginate fully so generateStaticParams covers the entire catalog.
async function getAllHandles(
  query: string,
  rootField: "products" | "collections",
): Promise<HandleNode[]> {
  if (!isShopifyConfigured) return [];
  const handles: HandleNode[] = [];
  let after: string | null = null;

  // Guard against runaway pagination on very large catalogs.
  for (let page = 0; page < 100; page++) {
    const data: HandlesData = await shopifyFetch<HandlesData>({
      query,
      variables: { first: 250, after },
    });

    const conn = data[rootField];
    handles.push(...conn.edges.map((e) => e.node));
    if (!conn.pageInfo.hasNextPage) break;
    after = conn.pageInfo.endCursor;
  }
  return handles;
}

export function getAllProductHandles() {
  return getAllHandles(GET_ALL_PRODUCT_HANDLES, "products");
}

export function getAllCollectionHandles() {
  return getAllHandles(GET_ALL_COLLECTION_HANDLES, "collections");
}

// ---------------------------------------------------------------------------
// Shopify Pages (content pages: shipping, contact, story, …)
// ---------------------------------------------------------------------------

export async function getPage(handle: string): Promise<Page | null> {
  if (!isShopifyConfigured) return null;
  const data = await shopifyFetch<{ page: Page | null }>({
    query: GET_PAGE_BY_HANDLE,
    variables: { handle },
  });
  return data.page ?? null;
}

export async function getAllPageHandles(): Promise<HandleNode[]> {
  if (!isShopifyConfigured) return [];
  const data = await shopifyFetch<{ pages: Connection<HandleNode> }>({
    query: GET_ALL_PAGE_HANDLES,
    variables: { first: 100 },
  });
  return flatten(data.pages);
}

// ---------------------------------------------------------------------------
// Metaobjects: "Caso de resultado" (before/after, editable desde Shopify)
// ---------------------------------------------------------------------------

type ResultCaseField = {
  key: string;
  value: string | null;
  reference: { image: { url: string; altText: string | null } } | null;
};
type ResultCaseNode = { id: string; handle: string; fields: ResultCaseField[] };

function reshapeResultCase(node: ResultCaseNode): ResultCase | null {
  const field = (k: string) => node.fields.find((f) => f.key === k);
  // Acepta tanto `before`/`after` como `before_image`/`after_image`.
  const before = (field("before") ?? field("before_image"))?.reference?.image?.url;
  const after = (field("after") ?? field("after_image"))?.reference?.image?.url;
  if (!before || !after) return null;
  return {
    id: node.id,
    title: field("title")?.value ?? "",
    before,
    after,
    position: Number(field("position")?.value ?? "0") || 0,
  };
}

export async function getResultCases(): Promise<ResultCase[]> {
  if (!isShopifyConfigured) return [];
  try {
    const data = await shopifyFetch<{ metaobjects: Connection<ResultCaseNode> }>({
      query: GET_RESULT_CASES,
      variables: { first: 12 },
    });
    return flatten(data.metaobjects)
      .map(reshapeResultCase)
      .filter((c): c is ResultCase => Boolean(c))
      .sort((a, b) => a.position - b.position);
  } catch {
    // El metaobjeto puede no existir aún o no estar expuesto a Storefront API.
    return [];
  }
}

type HeroFieldRef = {
  __typename: string;
  sources?: Array<{ url: string; mimeType: string; height: number | null }>;
  previewImage?: { url: string } | null;
  image?: { url: string; altText: string | null } | null;
  url?: string;
} | null;
type HeroNode = { fields: Array<{ key: string; reference: HeroFieldRef }> };

export async function getHero(): Promise<Hero | null> {
  if (!isShopifyConfigured) return null;
  try {
    const data = await shopifyFetch<{ metaobjects: Connection<HeroNode> }>({
      query: GET_HERO,
    });
    const node = flatten(data.metaobjects)[0];
    if (!node) return null;
    const ref = (k: string) =>
      node.fields.find((f) => f.key === k)?.reference ?? null;

    const video = ref("video");
    const poster = ref("poster");

    let videoUrl: string | null = null;
    if (video?.__typename === "Video" && video.sources?.length) {
      // Prefiere mp4; si no, la primera fuente disponible.
      videoUrl =
        video.sources.find((s) => s.mimeType === "video/mp4")?.url ??
        video.sources[0].url;
    } else if (video?.url) {
      videoUrl = video.url; // GenericFile (mp4 subido como archivo)
    }

    const posterUrl =
      poster?.image?.url ?? video?.previewImage?.url ?? null;

    if (!videoUrl) return null;
    return { videoUrl, posterUrl };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cart mutations (run client-side in the browser)
// ---------------------------------------------------------------------------

type CartLineInput = { merchandiseId: string; quantity: number };

export async function createCart(lines: CartLineInput[] = []): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
    query: CREATE_CART,
    variables: { lines },
    cache: "no-store",
  });
  return reshapeCart(data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: GET_CART,
    variables: { cartId },
    cache: "no-store",
  });
  return data.cart ? reshapeCart(data.cart) : null;
}

export async function addToCart(
  cartId: string,
  lines: CartLineInput[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query: ADD_TO_CART,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(data.cartLinesAdd.cart);
}

export async function updateCart(
  cartId: string,
  lines: Array<{ id: string; merchandiseId: string; quantity: number }>,
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>({
    query: UPDATE_CART,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>({
    query: REMOVE_FROM_CART,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return reshapeCart(data.cartLinesRemove.cart);
}
