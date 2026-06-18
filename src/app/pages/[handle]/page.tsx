import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { STATIC_PAGES, STATIC_PAGE_HANDLES } from "@/lib/content";
import { getAllPageHandles, getPage } from "@/lib/shopify";

export const dynamicParams = false;

export async function generateStaticParams() {
  const shopifyHandles = (await getAllPageHandles()).map((p) => p.handle);
  // Unión de páginas de Shopify + páginas por defecto (envíos, contacto, …),
  // así los links del footer siempre resuelven aunque no existan en Shopify.
  const handles = Array.from(new Set([...shopifyHandles, ...STATIC_PAGE_HANDLES]));
  return handles.map((handle) => ({ handle }));
}

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle);
  const fallback = STATIC_PAGES[handle];
  const title = page?.seo.title || page?.title || fallback?.title;
  if (!title) return { title: "Página no encontrada" };

  return {
    title,
    description: page?.seo.description || page?.bodySummary || undefined,
    alternates: { canonical: `/pages/${handle}` },
  };
}

export default async function StaticPage({ params }: Props) {
  const { handle } = await params;

  // Shopify tiene prioridad; si no existe, usamos el contenido por defecto.
  const page = await getPage(handle);
  const fallback = STATIC_PAGES[handle];

  const title = page?.title ?? fallback?.title;
  const html = page?.body ?? fallback?.html;

  if (!title || !html) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
      <div
        className="mt-8 text-sm leading-relaxed text-ink-soft [&_a]:text-accent [&_a]:underline [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-ink [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
