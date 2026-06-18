// Configuración de marca — ProGlass Care (manual de identidad).
// Editable para re-skin; la capa técnica no cambia entre marcas.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const BRAND = {
  name: "ProGlass",
  tagline: "Cuidado premium para tu día a día.",
  description:
    "ProGlass Care — soluciones premium para limpiar, proteger y conservar tu calzado, lentes y cuidado personal. Hecho en México, con resultados que se notan.",
  email: "hola@proglass.mx",
  madeIn: "Hecho en México",
  announcement: "Envío gratis en pedidos desde $799 · Hecho en México 🇲🇽",
  locale: "es-MX",
  currency: "MXN",
} as const;

export type NavItem = { label: string; href: string };

// Navegación principal por categorías (manual: Calzado · Visual · Personal).
// Los handles deben coincidir con los de tus colecciones en Shopify.
export const MAIN_NAV: NavItem[] = [
  { label: "Calzado", href: "/collections/calzado" },
  { label: "Visual", href: "/collections/visual" },
  { label: "Personal", href: "/collections/personal" },
  { label: "Más vendidos", href: "/collections/mas-vendidos" },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Productos",
    items: [
      { label: "Calzado", href: "/collections/calzado" },
      { label: "Visual", href: "/collections/visual" },
      { label: "Personal", href: "/collections/personal" },
      { label: "Más vendidos", href: "/collections/mas-vendidos" },
    ],
  },
  {
    title: "Ayuda",
    items: [
      { label: "Envíos y devoluciones", href: "/pages/envios" },
      { label: "Cómo usar", href: "/pages/como-usar" },
      { label: "Contacto", href: "/pages/contacto" },
    ],
  },
  {
    title: "Marca",
    items: [
      { label: "Nuestra historia", href: "/pages/historia" },
      { label: "Hecho en México", href: "/pages/hecho-en-mexico" },
    ],
  },
];

export const SOCIAL = {
  instagram: "https://instagram.com/proglass",
  tiktok: "https://tiktok.com/@proglass",
  facebook: "https://facebook.com/proglass",
  whatsapp: "https://wa.me/52",
} as const;

// Acentos por categoría (manual §2 / §7.4). Mapea el handle de la
// colección a su color de acento para badges y fichas.
export const CATEGORY_ACCENT: Record<string, string> = {
  sneakers: "var(--color-sneakers)",
  glow: "var(--color-glow)",
  fresh: "var(--color-fresh)",
  shield: "var(--color-shield)",
  vision: "var(--color-vision)",
  soft: "var(--color-soft)",
};
