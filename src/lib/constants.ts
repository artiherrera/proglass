// Brand-level configuration. Everything here is editable for a re-skin —
// the technical stack underneath stays identical between brands.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const BRAND = {
  name: "Proglass",
  tagline: "Premium eyewear, engineered to last.",
  description:
    "Proglass — premium eyewear and optics. Designed in detail, built to last, shipped worldwide.",
  email: "hola@proglass.com",
  locale: "es-MX",
  currency: "MXN",
} as const;

export type NavItem = { label: string; href: string };

// Primary navigation. Point hrefs at real Shopify collection handles.
export const MAIN_NAV: NavItem[] = [
  { label: "Novedades", href: "/collections/novedades" },
  { label: "Hombre", href: "/collections/hombre" },
  { label: "Mujer", href: "/collections/mujer" },
  { label: "Colecciones", href: "/collections" },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Tienda",
    items: [
      { label: "Novedades", href: "/collections/novedades" },
      { label: "Más vendidos", href: "/collections/mas-vendidos" },
      { label: "Todas las colecciones", href: "/collections" },
    ],
  },
  {
    title: "Ayuda",
    items: [
      { label: "Envíos y devoluciones", href: "/pages/envios" },
      { label: "Guía de tallas", href: "/pages/guia-de-tallas" },
      { label: "Contacto", href: "/pages/contacto" },
    ],
  },
  {
    title: "Marca",
    items: [
      { label: "Nuestra historia", href: "/pages/historia" },
      { label: "Sostenibilidad", href: "/pages/sostenibilidad" },
    ],
  },
];

export const SOCIAL = {
  instagram: "https://instagram.com/proglass",
  tiktok: "https://tiktok.com/@proglass",
  facebook: "https://facebook.com/proglass",
} as const;
