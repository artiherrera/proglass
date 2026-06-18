import Link from "next/link";

import { BRAND, FOOTER_NAV, SOCIAL } from "@/lib/constants";
import { PAYMENT_METHODS } from "@/lib/content";

export function Footer() {
  const year = 2026;

  return (
    <footer className="mt-20 border-t border-stone bg-stone-soft/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink"
            >
              {BRAND.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">{BRAND.tagline}</p>
            <div className="mt-4 flex gap-4 text-sm">
              <a href={SOCIAL.instagram} className="text-ink-soft hover:text-ink">
                Instagram
              </a>
              <a href={SOCIAL.tiktok} className="text-ink-soft hover:text-ink">
                TikTok
              </a>
            </div>
          </div>

          {FOOTER_NAV.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone pt-6 text-xs text-ink-soft/70 sm:flex-row">
          <p>
            © {year} {BRAND.name}. {BRAND.madeIn}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded border border-stone bg-paper px-2 py-1 text-[11px] font-medium text-ink-soft"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
