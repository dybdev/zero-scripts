import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Braces,
  Cable,
  Gauge,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ReviewMarquee } from "@/components/ui/review-marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCatalogueAdapter } from "@/lib/tebex/client";

const trustItems = [
  {
    title: "Optimized resources",
    description: "Predictable client and server paths under real load.",
    icon: Gauge,
  },
  {
    title: "Secure validation",
    description: "Sensitive actions stay authoritative on the server.",
    icon: ShieldCheck,
  },
  {
    title: "Framework ready",
    description: "Clear Qbox, QBCore, ESX, and standalone adapters.",
    icon: Cable,
  },
  {
    title: "Maintained guides",
    description: "Versioned setup, exports, and upgrade notes.",
    icon: BookOpenText,
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

  return (
    <>
      <section className="site-grid relative flex min-h-[700px] items-center overflow-hidden">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="content-shell relative px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/9 bg-[#111]/80 px-4 text-sm font-semibold text-[#bbb] backdrop-blur-md">
            <Braces
              size={15}
              strokeWidth={2}
              className="text-[var(--brand-red-light)]"
            />
            Production-ready FiveM resources
          </div>
          <h1 className="mx-auto mt-8 max-w-6xl text-[clamp(3rem,7vw,7rem)] leading-[0.96] font-extrabold tracking-[-0.065em] text-white">
            <span className="sr-only">Premium FiveM scripts.</span>
            <svg
              viewBox="0 0 1200 245"
              role="img"
              aria-label="Premium FiveM scripts"
              className="hero-title-outline mx-auto block h-auto w-full overflow-visible"
            >
              {[
                { text: "PREMIUM FIVEM", y: 96 },
                { text: "SCRIPTS.", y: 218 },
              ].map((line) => (
                <g key={line.text}>
                  <text
                    x="600"
                    y={line.y}
                    textAnchor="middle"
                    className="hero-title-dashes"
                  >
                    {line.text}
                  </text>
                  <text
                    x="600"
                    y={line.y}
                    textAnchor="middle"
                    className="hero-title-gap"
                  >
                    {line.text}
                  </text>
                  <text
                    x="600"
                    y={line.y}
                    textAnchor="middle"
                    className="hero-title-fill"
                  >
                    {line.text}
                  </text>
                </g>
              ))}
            </svg>
            <span className="mt-2 block text-[#858585]">
              Built without compromise.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-[var(--neutral-400)] sm:text-lg">
            Performance-first resources with secure server logic, clean
            framework integrations, and documentation your team can use.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/store" className="button-primary hero-cta px-7">
              <ShoppingBag size={18} strokeWidth={2.2} />
              Browse Products
            </Link>
            <Link href="/documentation" className="button-secondary px-7">
              View documentation
              <BookOpenText size={17} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      <section className="content-shell px-4 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {trustItems.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex gap-4">
              <Icon
                size={22}
                strokeWidth={2}
                className="mt-0.5 shrink-0 text-[var(--brand-red-light)]"
              />
              <div>
                <h2 className="text-base font-bold text-white">{title}</h2>
                <p className="mt-1.5 text-sm leading-6 text-[var(--neutral-400)]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-shell px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected releases"
            title="Featured resources"
            description="Focused systems built to be configured, extended, and maintained."
          />
          <Link
            href="/store"
            className="button-secondary hidden! shrink-0 sm:inline-flex!"
          >
            View all
            <ArrowRight size={16} strokeWidth={2.2} />
          </Link>
        </div>
        <ProductGrid products={featured} layout="featured" />
      </section>

      <section
        id="categories"
        className="content-shell scroll-mt-28 px-4 pt-24 sm:px-6 lg:px-8"
      >
        <SectionHeading
          eyebrow="Community feedback"
          title="What server owners say"
          description="A preview of the review experience. Connect verified Tebex or community feedback before launch."
        />
        <ReviewMarquee />
      </section>

      <section className="content-shell px-4 pt-24 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-12 lg:grid-cols-[.72fr_1.28fr]">
          <SectionHeading
            eyebrow="Support"
            title="Frequently asked questions"
            description="Quick answers about compatibility, delivery, documentation, and product support."
          />
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="content-shell px-4 pt-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-7 pb-12 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-[var(--brand-red-light)] uppercase">
              Ready when you are
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-white">
              Setup guides without the guesswork.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--neutral-400)]">
              Review dependencies, configuration, integrations, and upgrade
              notes before touching production.
            </p>
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <Link href="/documentation" className="button-primary flex-1">
              Documentation
            </Link>
            <Link href="/support" className="button-secondary flex-1">
              Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
