// Reusable GraphQL fragments for the Storefront API (2025-01).

export const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

export const seoFragment = /* GraphQL */ `
  fragment seo on SEO {
    title
    description
  }
`;

export const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    updatedAt
    options {
      id
      name
      optionValues {
        name
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            ...image
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    ratingMetafield: metafield(namespace: "reviews", key: "rating") {
      value
    }
    ratingCountMetafield: metafield(namespace: "reviews", key: "rating_count") {
      value
    }
    beforeImage: metafield(namespace: "custom", key: "before_image") {
      reference {
        ... on MediaImage {
          image {
            ...image
          }
        }
      }
    }
    afterImage: metafield(namespace: "custom", key: "after_image") {
      reference {
        ... on MediaImage {
          image {
            ...image
          }
        }
      }
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    id
    handle
    title
    description
    updatedAt
    image {
      ...image
    }
    seo {
      ...seo
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              image {
                ...image
              }
              product {
                id
                handle
                title
                featuredImage {
                  ...image
                }
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
`;
