// Contenido de marketing y páginas estáticas (editable sin tocar componentes).
// Estructura inspirada en la tienda de referencia del manual (lodoal.com.mx).

export type Guarantee = { icon: string; title: string; text: string };

export const GUARANTEES: Guarantee[] = [
  { icon: "truck", title: "Envío gratis", text: "En pedidos desde $799" },
  { icon: "shield-check", title: "Garantía 30 días", text: "Devolución sin complicaciones" },
  { icon: "zap", title: "Acción rápida", text: "Resultados desde el primer uso" },
  { icon: "badge-check", title: "Hecho en México", text: "Calidad premium de origen" },
];

// Pilares de marca (manual §1) → sección "Sellos de confianza".
export type Pillar = { icon: string; title: string; text: string };

export const PILLARS: Pillar[] = [
  {
    icon: "sparkles",
    title: "Calidad Premium",
    text: "Fórmulas y materiales de alta calidad para un cuidado superior.",
  },
  {
    icon: "shield-check",
    title: "Confianza",
    text: "Transparencia y seguridad en cada producto que acompaña tu rutina.",
  },
  {
    icon: "lightbulb",
    title: "Innovación",
    text: "Soluciones inteligentes que marcan la diferencia.",
  },
  {
    icon: "trending-up",
    title: "Resultados Reales",
    text: "Efectividad comprobada: una limpieza y protección que se nota.",
  },
  {
    icon: "badge-check",
    title: "Hecho en México",
    text: "Orgullosamente desarrollado y producido en México, pensando en ti.",
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "90%", label: "nota resultados desde la primera semana" },
  { value: "95%", label: "lo recomienda a alguien más" },
  { value: "90%", label: "de satisfacción de clientes" },
];

export type Testimonial = { name: string; rating: number; quote: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Mariana G.",
    rating: 5,
    quote:
      "Mis tenis quedaron como nuevos. La diferencia se nota desde la primera aplicación.",
  },
  {
    name: "Carlos R.",
    rating: 5,
    quote:
      "Por fin un producto mexicano premium que cumple. La protección dura semanas.",
  },
  {
    name: "Daniela M.",
    rating: 4,
    quote:
      "Súper fácil de usar y el envío llegó rapidísimo. Ya lo recomendé a mi familia.",
  },
];

export const PAYMENT_METHODS = ["Visa", "Mastercard", "Amex", "PayPal"];

// --- Enfoque "vende el resultado" (before/after) -------------------------

// Imágenes por defecto del comparador. Reemplázalas por fotos reales en
// /public o, por producto, desde metafields de Shopify.
export const DEFAULT_BEFORE_AFTER = {
  before: "/ba-before.svg",
  after: "/ba-after.svg",
};

export const RESULT_BENEFITS = [
  "Recupera el aspecto original",
  "Elimina manchas y malos olores",
  "Protege y prolonga la vida útil",
];

export type ResultItem = { title: string; before: string; after: string };

// Casos para la sección "Resultados que se ven" (mínimo 3). Reemplaza cada
// imagen por fotos reales en /public (o conéctalas a metafields de Shopify).
export const RESULTS: ResultItem[] = [
  { title: "Tenis blancos", before: "/ba-before.svg", after: "/ba-after.svg" },
  { title: "Pantalla de teléfono", before: "/ba-before.svg", after: "/ba-after.svg" },
  { title: "Lentes opacos", before: "/ba-before.svg", after: "/ba-after.svg" },
];

export type Step = { n: number; title: string; text: string };

export const STEPS: Step[] = [
  { n: 1, title: "Aplica", text: "Aplica ProGlass sobre la superficie a tratar." },
  { n: 2, title: "Talla", text: "Frota suavemente con el paño de microfibra." },
  { n: 3, title: "Listo", text: "Deja secar y disfruta el resultado premium." },
];

// Contenido por defecto de páginas estáticas. Si existe una página con el mismo
// handle en Shopify, esa tiene prioridad (se puede editar sin código).
export type StaticPage = { title: string; html: string };

export const STATIC_PAGES: Record<string, StaticPage> = {
  envios: {
    title: "Envíos y devoluciones",
    html: `
      <p><strong>Envío gratis</strong> en pedidos desde $799. Para pedidos menores, el costo se calcula en el checkout.</p>
      <h2>Tiempos de entrega</h2>
      <ul>
        <li>Zona metropolitana: 2 a 4 días hábiles.</li>
        <li>Resto del país: 3 a 7 días hábiles.</li>
      </ul>
      <h2>Devoluciones</h2>
      <p>Cuentas con <strong>30 días</strong> para solicitar tu devolución. El producto debe estar en buen estado. Escríbenos y te guiamos en el proceso.</p>
    `,
  },
  "como-usar": {
    title: "Cómo usar",
    html: `
      <p>Cada producto ProGlass incluye instrucciones en su etiqueta. Como guía general:</p>
      <ol>
        <li>Limpia la superficie de polvo o suciedad suelta.</li>
        <li>Aplica el producto de forma uniforme.</li>
        <li>Deja actuar el tiempo indicado y retira con un paño de microfibra.</li>
      </ol>
      <p>Para mejores resultados, repite el cuidado de forma regular.</p>
    `,
  },
  contacto: {
    title: "Contacto",
    html: `
      <p>¿Tienes dudas o necesitas ayuda para elegir? Estamos para ayudarte.</p>
      <ul>
        <li><strong>Correo:</strong> hola@proglass.mx</li>
        <li><strong>WhatsApp:</strong> escríbenos para atención inmediata.</li>
        <li><strong>Horario:</strong> Lunes a viernes, 9:00 – 18:00 (CDMX).</li>
      </ul>
    `,
  },
  historia: {
    title: "Nuestra historia",
    html: `
      <p>ProGlass Care nació para convertir una rutina ordinaria de cuidado en una experiencia premium.</p>
      <p>Desarrollamos fórmulas inteligentes para <strong>limpiar, proteger y conservar</strong> tu calzado, tus lentes y tu cuidado personal — con estándar profesional y orgullo mexicano.</p>
    `,
  },
  "hecho-en-mexico": {
    title: "Hecho en México",
    html: `
      <p>Cada producto ProGlass se desarrolla y produce en México, pensando en ti.</p>
      <p>Apostamos por la calidad local, fórmulas de alto rendimiento y resultados que se notan. <strong>Cuidado premium para tu día a día.</strong></p>
    `,
  },
};

export const STATIC_PAGE_HANDLES = Object.keys(STATIC_PAGES);
