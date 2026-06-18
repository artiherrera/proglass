#!/usr/bin/env node
// Diagnóstico de conexión con Shopify Storefront API.
//
//   npm run shopify:check
//
// Lee .env.local, verifica el token y muestra: tienda, productos de ejemplo
// y los HANDLES de tus colecciones (para cablear MAIN_NAV en
// src/lib/constants.ts). Sin dependencias externas.

import { readFileSync } from "node:fs";

// --- carga mínima de .env.local (las vars del shell tienen prioridad) ------
try {
  const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
} catch {
  // sin .env.local: seguimos con las vars del entorno (si las hay)
}

const DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  "";
const TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  "";
const VERSION =
  process.env.SHOPIFY_API_VERSION ||
  process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ||
  "2025-01";

const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

function fail(msg) {
  console.error(`\n${c.red("✗")} ${msg}\n`);
  process.exit(1);
}

if (!DOMAIN || !TOKEN || DOMAIN.startsWith("tu-tienda")) {
  fail(
    `Faltan credenciales en .env.local.\n\n` +
      `  1. cp .env.example .env.local\n` +
      `  2. Rellena SHOPIFY_STORE_DOMAIN y SHOPIFY_STOREFRONT_ACCESS_TOKEN\n` +
      `     (y sus equivalentes NEXT_PUBLIC_*).\n` +
      `  El token sale de la app oficial "Headless" en Shopify Admin.`,
  );
}

const QUERY = /* GraphQL */ `
  query Diagnostic {
    shop {
      name
      primaryDomain { url }
      paymentSettings { currencyCode }
    }
    products(first: 5) {
      edges { node { title handle availableForSale } }
    }
    collections(first: 100) {
      edges { node { handle title } }
    }
  }
`;

const endpoint = `https://${DOMAIN}/api/${VERSION}/graphql.json`;
console.log(c.dim(`\n→ ${endpoint}\n`));

let res;
try {
  res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query: QUERY }),
  });
} catch (err) {
  fail(`Error de red: ${err.message}\n  Revisa que el dominio sea correcto.`);
}

if (res.status === 401 || res.status === 403) {
  fail(
    `Token rechazado (${res.status}).\n` +
      `  El Storefront access token es inválido o no tiene permisos.\n` +
      `  Regenéralo en la app Headless de Shopify Admin.`,
  );
}
if (!res.ok) fail(`Shopify respondió ${res.status}.`);

const body = await res.json();
if (body.errors?.length) {
  fail(`Errores GraphQL:\n  ${body.errors.map((e) => e.message).join("\n  ")}`);
}

const { shop, products, collections } = body.data;
const prods = products.edges.map((e) => e.node);
const cols = collections.edges.map((e) => e.node);

console.log(c.green("✓ Conexión OK"));
console.log(`\n  ${c.bold("Tienda:")}   ${shop.name}`);
console.log(`  ${c.bold("Dominio:")}  ${shop.primaryDomain?.url ?? "—"}`);
console.log(`  ${c.bold("Moneda:")}   ${shop.paymentSettings?.currencyCode ?? "—"}`);

console.log(`\n  ${c.bold(`Productos (muestra de ${prods.length}):`)}`);
if (prods.length === 0) {
  console.log(c.yellow("    ⚠ No hay productos publicados en el canal Headless."));
} else {
  for (const p of prods) {
    const stock = p.availableForSale ? "" : c.dim(" (agotado)");
    console.log(`    · ${p.title} ${c.dim(`/products/${p.handle}`)}${stock}`);
  }
}

console.log(`\n  ${c.bold(`Colecciones (${cols.length}):`)}`);
if (cols.length === 0) {
  console.log(c.yellow("    ⚠ No hay colecciones. Créalas en Shopify Admin."));
} else {
  for (const col of cols) {
    console.log(`    · ${col.title} ${c.dim(`→ handle: "${col.handle}"`)}`);
  }
  console.log(
    c.dim(
      `\n  Usa estos handles en MAIN_NAV (src/lib/constants.ts), p. ej.:\n` +
        `    { label: "${cols[0].title}", href: "/collections/${cols[0].handle}" }`,
    ),
  );
}

console.log(
  c.dim(`\n  Siguiente: actualiza la nav y corre 'npm run dev' o 'npm run build'.\n`),
);
