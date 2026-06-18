# Proglass — Headless Storefront

E-commerce headless premium. Catálogo en **Shopify**, frontend custom en
**Next.js 16** exportado como sitio estático y servido en **AWS Amplify**.
El stack es reutilizable: cualquier marca con catálogo en Shopify puede
re-skinear el diseño sin tocar la arquitectura.

```
Browser → Amplify (CDN/SSL) → static Next.js export
                                   ↑ build time          ↓ runtime (browser)
                          Shopify Storefront API ← Cart API / Klaviyo / GA4
```

## Stack

| Capa        | Tecnología                                            |
| ----------- | ----------------------------------------------------- |
| Frontend    | Next.js 16 (App Router, RSC), React 19, TypeScript    |
| Estilos     | Tailwind CSS v4 (`@theme`), fuentes Bevan/Zilla/Inter |
| Backend     | Shopify Storefront API (GraphQL, read-only)           |
| Carrito     | Shopify Cart API (mutaciones client-side, sin backend)|
| Checkout    | Shopify Hosted Checkout                               |
| Hosting     | AWS Amplify (static export → `out/`)                  |
| Integraciones | Klaviyo, Judge.me (vía metafields), GA4 (opcionales) |

## Cómo funciona el render

`output: "export"` genera HTML estático en build:

- Los **Server Components** consultan Shopify **en build time** y
  pre-renderizan home, PDP y colecciones (`generateStaticParams`).
- El **carrito** vive 100% en el navegador (`localStorage` + Cart API), por
  eso no hace falta servidor en runtime.
- Cuando cambia un producto, un **webhook de Shopify** dispara un rebuild en
  Amplify (no hay ISR en static export).

## Setup

### 1. Shopify

1. Crea la tienda y carga productos.
2. Instala la app oficial **Headless** (Shopify Admin → Apps) → genera el
   **Storefront API access token** (read-only, público).
3. (Opcional) Define **Metaobjects** para Hero / Brand / Category cards.
4. Judge.me sincroniza ratings en metafields `reviews.rating` /
   `reviews.rating_count` (ya los leemos en el PDP y en las cards).

### 2. Variables de entorno

Copia la plantilla y rellena el token:

```bash
cp .env.example .env.local
```

```env
SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxx
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxx
NEXT_PUBLIC_SITE_URL=https://tudominio.com
# Opcionales:
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY=
```

> El mismo token read-only se usa en build (server) y en el navegador
> (carrito). Las vars `NEXT_PUBLIC_*` son las que llegan al cliente.

### 3. Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
```

Sin credenciales el sitio **igual arranca**: muestra un aviso de setup y un
catálogo vacío (degradación controlada en `lib/shopify`).

### 4. Build / export estático

```bash
npm run build    # genera ./out (HTML estático)
```

## Deploy en AWS Amplify

1. AWS Amplify Console → **New app** → conecta el repo de GitHub.
2. Amplify detecta [`amplify.yml`](./amplify.yml) (artefacto: `out/`).
3. Carga las env vars en Amplify (las mismas de `.env.local`).
4. Conecta el dominio custom (SSL automático vía ACM).

### Rebuild automático por webhook

1. Amplify Console → App settings → **Build settings** → crea un
   *Incoming webhook* y copia la URL.
2. Shopify Admin → **Settings → Notifications → Webhooks** →
   evento *Product update* (JSON) → pega la URL de Amplify.

Cada cambio de producto regenera el sitio.

## Estructura

```
src/
├── app/
│   ├── layout.tsx                  fuentes, header/footer, CartProvider
│   ├── page.tsx                    home (hero + destacados + colecciones)
│   ├── products/[handle]/page.tsx  PDP (SSG + JSON-LD + metadata)
│   ├── collections/[handle]/page.tsx
│   ├── collections/page.tsx
│   ├── cart/page.tsx
│   ├── sitemap.ts · robots.ts · not-found.tsx
│   └── globals.css                 tokens de marca (@theme)
├── components/
│   ├── Header · Footer · Hero · ProductCard · ProductGrid
│   ├── CollectionCard · Price · Rating · SetupNotice · Analytics
│   ├── product/ProductView · ProductGallery
│   └── cart/cart-context · CartDrawer · CartContents · CartLineItem
└── lib/
    ├── shopify/                    client · queries · mutations · fragments · index · types
    ├── constants.ts                marca, navegación, social (editable)
    ├── analytics.ts                GA4 + Klaviyo (no-op sin keys)
    └── utils.ts
```

## Re-skin para otra marca

1. Edita [`src/lib/constants.ts`](src/lib/constants.ts) (nombre, nav, social).
2. Ajusta tokens de color/fuente en [`src/app/globals.css`](src/app/globals.css).
3. Cambia las fuentes en [`src/app/layout.tsx`](src/app/layout.tsx).
4. Apunta a la nueva tienda Shopify vía `.env.local`.

La capa técnica (`lib/shopify`, carrito, páginas) no cambia entre marcas.
