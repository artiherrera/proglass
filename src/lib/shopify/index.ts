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
  GET_PRODUCTS,
} from "./queries";
import type {
  Cart,
  Collection,
  Connection,
  Page,
  Product,
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

  const { images, variants, options, ratingMetafield, ratingCountMetafield, ...rest } =
    product;

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
