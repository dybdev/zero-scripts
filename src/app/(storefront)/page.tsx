import Link from "next/link";

import { HeroEntrance } from "@/components/motion/hero-entrance";
import { ProductArtwork } from "@/components/product/product-artwork";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductPrice } from "@/components/product/product-price";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCatalogueAdapter } from "@/lib/tebex/client";

const principles = [
  {
    title: "Built for load",
    description:
      "Client and server paths stay predictable under real player load.",
  },
  {
    title: "Server decides",
    description:
      "Money, items and damage are validated on the server. The client only asks.",
  },
  {
    title: "Any framework",
    description:
      "Bridges for Qbox, QBCore and ESX, or run it standalone with no framework at all.",
  },
  {
    title: "Documented",
    description:
      "Every release ships with setup steps, exports and upgrade notes for that version.",
  },
];

const faqs = [
  {
    question: "Which frameworks are supported?",
    answer:
      "Compatibility is listed on every product page. Resources may support Qbox, QBCore, ESX, standalone installations, or a focused combination of them.",
  },
  {
    question: "Where can I find installation instructions?",
    answer:
      "Each purchase links to its versioned setup guide, requirements, configuration notes, and upgrade instructions in the documentation area.",
  },
  {
    question: "How are purchases delivered?",
    answer:
      "Checkout and fulfilment are handled securely through Tebex. Available downloads appear through the account connected to your purchase.",
  },
  {
    question: "How do I get product support?",
    answer:
      "Use the support page to reach the official support channel. Include your order details, resource version, framework, and relevant error output.",
  },
];

export default async function HomePage() {
  const products = await getCatalogueAdapter().getPackages();
  const explicitlyFeatured = products.filter((product) => product.featured);
  const featured = (
    explicitlyFeatured.length ? explicitlyFeatured : products
  ).slice(0, 3);
  const spotlight = featured[0];

  return (
    <>
      <section className="content-shell px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[min(calc(100svh-96px),880px)] items-center gap-12 py-14 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
          <HeroEntrance>
            <p className="note">
              fivem resources · qbox · qbcore · esx · standalone
            </p>
            <h1 className="mt-6 text-[clamp(3.25rem,6.6vw,6.75rem)] leading-[0.88] text-white">
              Premium FiveM scripts,{" "}
              <span className="mark text-[var(--neutral-400)]">
                built to survive
              </span>{" "}
              real servers.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-[var(--neutral-400)] sm:text-lg sm:leading-8">
              Server-validated logic, bridges for every major framework, and
              setup guides your staff can follow without asking.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/store" className="button-primary px-7">
                Browse the store
              </Link>
              <Link href="/documentation" className="button-secondary px-7">
                Read the docs
              </Link>
            </div>
          </HeroEntrance>

          {spotlight ? (
            <HeroEntrance delay={0.2}>
              <Link
                href={`/store/package/${spotlight.slug}`}
                className="product-card group block overflow-hidden"
              >
                <div className="relative aspect-[1.2/1] overflow-hidden bg-[var(--background)]">
                  <ProductArtwork
                    product={spotlight}
                    priority
                    className="product-card-image h-full w-full"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-[var(--line)] p-5">
                  <span className="font-display text-2xl leading-none text-white">
                    {spotlight.name}
                  </span>
                  <ProductPrice
                    amount={spotlight.price}
                    currency={spotlight.currency}
                    className="text-base"
                  />
                </div>
              </Link>
            </HeroEntrance>
          ) : null}
        </div>
      </section>

      <section className="border-y border-[var(--line)]">
        <ol className="content-shell grid px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {principles.map(({ title, description }, index) => (
            <li
              key={title}
              className="border-[var(--line)] py-8 sm:px-6 sm:first:pl-0 sm:even:border-l lg:border-l lg:first:border-l-0"
            >
              <span className="index text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 text-2xl text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--neutral-400)]">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="content-shell px-4 pt-28 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <SectionHeading
            index="01"
            title="Featured"
            eyebrow="current releases"
            description="Focused systems you can configure, extend and keep running."
          />
          <Link
            href="/store"
            className="link-draw note hidden shrink-0 pb-1 text-[var(--foreground)] sm:inline"
          >
            view all resources
          </Link>
        </div>
        <ProductGrid products={featured} layout="featured" />
      </section>

      <section className="content-shell px-4 pt-32 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeading
            index="02"
            title="Questions"
            eyebrow="before you buy"
            description="Compatibility, delivery, documentation and support."
          />
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="content-shell px-4 pt-32 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 border-t border-[var(--line)] pt-12 md:flex-row md:items-end">
          <div>
            <span className="index text-lg">03</span>
            <h2 className="mt-3 max-w-3xl text-[clamp(2.5rem,5vw,4.25rem)] text-white">
              Read the setup guide <span className="mark">before</span>{" "}
              production.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--neutral-400)]">
              Dependencies, configuration, integrations and upgrade notes,
              versioned with each release.
            </p>
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <Link href="/documentation" className="button-primary flex-1">
              Open the docs
            </Link>
            <Link href="/support" className="button-secondary flex-1">
              Get support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
