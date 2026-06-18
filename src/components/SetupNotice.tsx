// Rendered on catalog pages when Shopify credentials are not yet set, so
// the storefront builds and runs end-to-end before the store is connected.
export function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl rounded-card border border-dashed border-accent/50 bg-stone-soft/60 p-8 text-center">
      <h2 className="font-serif text-xl text-ink">Conecta tu tienda Shopify</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Aún no hay credenciales configuradas, así que no se muestran productos.
        Crea un archivo{" "}
        <code className="rounded bg-ink/5 px-1.5 py-0.5 text-ink">.env.local</code>{" "}
        con estas variables y reinicia el servidor:
      </p>
      <pre className="mt-4 overflow-x-auto rounded-md bg-ink p-4 text-left text-xs leading-relaxed text-paper">
{`SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=tu_token
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=tu-tienda.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=tu_token`}
      </pre>
      <p className="mt-3 text-xs text-ink-soft/70">
        El token se obtiene instalando la app oficial <strong>Headless</strong> en
        Shopify Admin.
      </p>
    </div>
  );
}
