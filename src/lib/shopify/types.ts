// Clean, reshaped domain types used throughout the app.
// Raw Shopify Storefront responses (with edges/nodes connections) are
// flattened into these shapes inside `lib/shopify/index.ts`.

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: ShopifyImage | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  seo: { title: string; description: string };
  // Judge.me ratings synced into Shopify metafields (reviews namespace).
  rating: number | null;
  ratingCount: number | null;
  // Before/after images from product metafields (custom namespace).
  beforeAfter: { before: string; after: string } | null;
  updatedAt: string;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  seo: { title: string; description: string };
  updatedAt: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    price: Money;
    image: ShopifyImage | null;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: CartLine[];
};

// ---------------------------------------------------------------------------
// Raw Shopify connection shapes (only what we read back from GraphQL).
// ---------------------------------------------------------------------------

export type Connection<T> = {
  edges: Array<{ node: T }>;
};

export type ShopifyMetafield = {
  value: string;
} | null;

// Raw shape of a file/image metafield resolved through its MediaImage reference.
export type ShopifyImageMetafield = {
  reference: { image: ShopifyImage } | null;
} | null;

export type ShopifyProduct = Omit<
  Product,
  "images" | "variants" | "options" | "rating" | "ratingCount" | "beforeAfter"
> & {
  images: Connection<ShopifyImage>;
  variants: Connection<ProductVariant>;
  options: Array<{ id: string; name: string; optionValues: Array<{ name: string }> }>;
  ratingMetafield: ShopifyMetafield;
  ratingCountMetafield: ShopifyMetafield;
  beforeImage: ShopifyImageMetafield;
  afterImage: ShopifyImageMetafield;
};

// A "Caso de resultado" metaobject (before/after) managed in Shopify Admin.
export type ResultCase = {
  id: string;
  title: string;
  before: string;
  after: string;
  position: number;
};

export type ShopifyCollection = Collection;

export type ShopifyCart = Omit<Cart, "lines"> & {
  lines: Connection<CartLine>;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string; // HTML
  bodySummary: string;
  seo: { title: string; description: string };
  updatedAt: string;
};
