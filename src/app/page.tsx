import Link from "next/link";

import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { SetupNotice } from "@/components/SetupNotice";
import { CategoryCards } from "@/components/home/CategoryCards";
import { Guarantees } from "@/components/home/Guarantees";
import { HelpBanner } from "@/components/home/HelpBanner";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Newsletter } from "@/components/home/Newsletter";
import { Pillars } from "@/components/home/Pillars";
import { ProblemSolution } from "@/components/home/ProblemSolution";
import { ResultsShowcase } from "@/components/home/ResultsShowcase";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";
import { getProducts, isShopifyConfigured } from "@/lib/shopify";

export default async function HomePage() {
  const featured = await getProducts({ first: 8, sortKey: "BEST_SELLING" });

  return (
    <>
      <Hero />
      <Guarantees />

      {/* Vende el resultado: comparador antes/después */}
      <ResultsShowcase />
      <ProblemSolution />

      {/* Más vendidos */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-2xl text-ink sm:text-3xl">Más vendidos</h2>
          <Link
            href="/collections/mas-vendidos"
            className="text-sm font-medium text-accent hover:text-accent-dark"
          >
            Ver todo →
          </Link>
        </div>
        {featured.length > 0 ? (
          <ProductGrid products={featured} />
        ) : isShopifyConfigured ? (
          <p className="text-ink-soft">
            Aún no hay productos publicados en el canal Headless.
          </p>
        ) : (
          <SetupNotice />
        )}
      </section>

      <HowItWorks />
      <CategoryCards />
      <Pillars />
      <Stats />
      <Testimonials />
      <HelpBanner />
      <Newsletter />
    </>
  );
}
