import {
  cartFragment,
  collectionFragment,
  productFragment,
} from "./fragments";

export const GET_PRODUCTS = /* GraphQL */ `
  query getProducts(
    $first: Int = 24
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const GET_PRODUCT_RECOMMENDATIONS = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;

// Lightweight query used by generateStaticParams — handles + updatedAt only.
export const GET_ALL_PRODUCT_HANDLES = /* GraphQL */ `
  query getAllProductHandles($first: Int = 250, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`;

export const GET_COLLECTIONS = /* GraphQL */ `
  query getCollections($first: Int = 50) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;

export const GET_COLLECTION_BY_HANDLE = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const GET_COLLECTION_PRODUCTS = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $first: Int = 48
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;

export const GET_ALL_COLLECTION_HANDLES = /* GraphQL */ `
  query getAllCollectionHandles($first: Int = 250, $after: String) {
    collections(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`;

export const GET_CART = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;

export const GET_PAGE_BY_HANDLE = /* GraphQL */ `
  query getPage($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
      bodySummary
      seo {
        title
        description
      }
      updatedAt
    }
  }
`;

export const GET_ALL_PAGE_HANDLES = /* GraphQL */ `
  query getAllPageHandles($first: Int = 100) {
    pages(first: $first) {
      edges {
        node {
          handle
          updatedAt
        }
      }
    }
  }
`;

// Metaobjeto "Caso de resultado" (before/after) — type handle: result_case.
export const GET_RESULT_CASES = /* GraphQL */ `
  query getResultCases($first: Int = 12) {
    metaobjects(type: "result_case", first: $first) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;
