import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CalendarDays,
  CircleCheck,
  Package,
  Wrench,
} from "lucide-react";
import sanitizeHtml from "sanitize-html";

import { AddToBasketButton } from "@/components/product/add-to-basket-button";
import { CompatibilityBadge } from "@/components/product/compatibility-badge";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductArtwork } from "@/components/product/product-artwork";
import { ProductPrice } from "@/components/product/product-price";
import { GlassPanel } from "@/components/ui/glass-panel";
import { getCatalogueAdapter } from "@/lib/tebex/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogueAdapter().getPackage(slug);
  if (!product) return { title: "Resource not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} - Zero Scripts`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const adapter = getCatalogueAdapter();
  const [product, allProducts] = await Promise.all([
    adapter.getPackage(slug),
    adapter.getPackages(),
  ]);
  if (!product) notFound();
  const related = allProducts
    .filter(
      (item) =>
        item.id !== product.id && item.categorySlug === product.categorySlug,
    )
    .slice(0, 4);
  const safeHtml = sanitizeHtml(product.descriptionHtml, {
    allowedTags: ["p", "strong", "em", "ul", "ol", "li", "br", "a"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });

  return (
    <>
      <div className="content-shell px-4 pt-8 pb-24 sm:px-6 lg:px-8 lg:pb-0">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#777]"
        >
          <Link
            href="/store"
            className="inline-flex min-h-10 items-center gap-1.5 hover:text-white"
          >
            <ArrowLeft size={13} strokeWidth={2.2} />
            Store
          </Link>
          <span>/</span>
          <Link
            href={`/store/category/${product.categorySlug}`}
            className="inline-flex min-h-10 items-center hover:text-white"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#bbb]">{product.name}</span>
        </nav>

        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,.7fr)]">
          <div className="min-w-0">
            <div className="relative aspect-[1.45/1] overflow-hidden rounded-[14px] border border-white/8 bg-[#111]">
              <ProductArtwork
                product={product}
                priority
                className="h-full w-full"
              />
              {product.status ? (
                <span className="absolute top-4 left-4 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 text-[10px] font-bold text-white uppercase backdrop-blur-md">
                  {product.status}
                </span>
              ) : null}
            </div>
            {product.gallery.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {product.gallery.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[1.45/1] overflow-hidden rounded-[10px] border border-white/8 bg-[#111]"
                  >
                    <ProductArtwork
                      product={product}
                      src={image}
                      className="h-full w-full"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="relative self-start lg:sticky lg:top-24">
            <GlassPanel className="p-5 sm:p-6">
              <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--brand-red-light)] uppercase">
                {product.category}
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-white">
                {product.name}
              </h1>
              <div className="mt-5 flex flex-wrap gap-2">
                {product.compatibility.map((label) => (
                  <CompatibilityBadge key={label} label={label} />
                ))}
              </div>
              <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/8 pt-6">
                <div>
                  <p className="text-[10px] font-semibold text-[#777] uppercase">
                    One-time license
                  </p>
                  <ProductPrice
                    amount={product.price}
                    currency={product.currency}
                    className="mt-1 block text-2xl"
                  />
                </div>
                <span className="text-[10px] text-[#777]">
                  Taxes at checkout
                </span>
              </div>
              <AddToBasketButton product={product} className="mt-5 w-full" />
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/8 pt-5 text-[11px]">
                <div className="flex gap-2">
                  <Package size={15} strokeWidth={2} className="text-[#888]" />
                  <span className="text-[#777]">
                    Version
                    <strong className="mt-0.5 block text-[#ccc]">
                      {product.version}
                    </strong>
                  </span>
                </div>
                <div className="flex gap-2">
                  <CalendarDays
                    size={15}
                    strokeWidth={2}
                    className="text-[#888]"
                  />
                  <span className="text-[#777]">
                    Updated
                    <strong className="mt-0.5 block text-[#ccc]">
                      {product.lastUpdated}
                    </strong>
                  </span>
                </div>
              </div>
            </GlassPanel>
            <div className="absolute inset-x-0 top-[calc(100%+1rem)] hidden space-y-4 lg:block">
              <div className="rounded-[12px] border border-white/8 bg-[#151515] p-5">
                <BookOpenText
                  size={23}
                  strokeWidth={2}
                  className="text-[var(--brand-red-light)]"
                />
                <h2 className="mt-4 text-base font-bold text-white">
                  Read before installing
                </h2>
                <p className="mt-2 text-xs leading-5 text-[var(--neutral-400)]">
                  Review dependencies, configuration, exports, and framework
                  notes in the setup guide.
                </p>
                <Link
                  href="/documentation"
                  className="button-secondary mt-5 w-full"
                >
                  Open documentation
                  <ArrowRight size={15} strokeWidth={2.2} />
                </Link>
              </div>
              <div className="rounded-[12px] border border-white/8 bg-white/[0.02] p-5">
                <h2 className="text-xs font-bold text-white">Dependencies</h2>
                <ul className="mt-3 space-y-2 text-xs text-[var(--neutral-400)]">
                  {product.dependencies.map((dependency) => (
                    <li key={dependency}>- {dependency}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,.7fr)]">
          <div className="min-w-0 space-y-10">
            <section>
              <h2 className="text-xl font-bold tracking-[-0.03em] text-white">
                About this resource
              </h2>
              <div
                className="rich-text mt-4 text-sm leading-7 text-[var(--neutral-400)]"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </section>
            <section>
              <h2 className="text-xl font-bold tracking-[-0.03em] text-white">
                Features
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex gap-3 rounded-[10px] border border-white/7 bg-white/[0.02] p-4 text-xs leading-5 text-[#bbb]"
                  >
                    <CircleCheck
                      size={17}
                      strokeWidth={2.2}
                      className="mt-0.5 shrink-0 text-[var(--brand-red-light)]"
                    />
                    {feature}
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold tracking-[-0.03em] text-white">
                Installation requirements
              </h2>
              <ul className="mt-4 space-y-3">
                {product.requirements.map((requirement) => (
                  <li
                    key={requirement}
                    className="flex items-center gap-3 text-sm text-[var(--neutral-400)]"
                  >
                    <Wrench
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-[#777]"
                    />
                    {requirement}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-[-0.03em] text-white">
                  Changelog preview
                </h2>
                <Link
                  href="/documentation"
                  className="text-xs font-bold text-[var(--brand-red-light)] hover:text-white"
                >
                  Full changelog
                </Link>
              </div>
              {product.changelog.map((change) => (
                <div
                  key={change.version}
                  className="mt-4 rounded-[12px] border border-white/8 bg-[#151515] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      Version {change.version}
                    </span>
                    <span className="text-[11px] text-[#777]">
                      {change.date}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[var(--neutral-400)]">
                    {change.notes}
                  </p>
                </div>
              ))}
            </section>
          </div>
          <aside className="lg:hidden">
            <div className="rounded-[12px] border border-white/8 bg-[#151515] p-5">
              <BookOpenText
                size={23}
                strokeWidth={2}
                className="text-[var(--brand-red-light)]"
              />
              <h2 className="mt-4 text-base font-bold text-white">
                Read before installing
              </h2>
              <p className="mt-2 text-xs leading-5 text-[var(--neutral-400)]">
                Review dependencies, configuration, exports, and framework notes
                in the setup guide.
              </p>
              <Link
                href="/documentation"
                className="button-secondary mt-5 w-full"
              >
                Open documentation
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
            <div className="mt-4 rounded-[12px] border border-white/8 bg-white/[0.02] p-5">
              <h2 className="text-xs font-bold text-white">Dependencies</h2>
              <ul className="mt-3 space-y-2 text-xs text-[var(--neutral-400)]">
                {product.dependencies.map((dependency) => (
                  <li key={dependency}>- {dependency}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {related.length ? (
          <section className="mt-20">
            <h2 className="text-2xl font-bold tracking-[-0.035em] text-white">
              Related resources
            </h2>
            <div className="mt-6">
              <ProductGrid products={related} />
            </div>
          </section>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#101010]/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">
              {product.name}
            </p>
            <ProductPrice
              amount={product.price}
              currency={product.currency}
              className="text-sm"
            />
          </div>
          <AddToBasketButton product={product} />
        </div>
      </div>
    </>
  );
}
