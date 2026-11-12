import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { getCatalogueAdapter } from "@/lib/tebex/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCatalogueAdapter().getCategories();
  const category = categories.find((item) => item.slug === slug);
  return { title: category?.name ?? "Category" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const adapter = getCatalogueAdapter();
  const [categories, products] = await Promise.all([
    adapter.getCategories(),
    adapter.getPackages(),
  ]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const matching = products.filter(
    (product) => product.categorySlug === category.slug,
  );

  return (
    <div className="content-shell px-4 pt-12 sm:px-6 lg:px-8">
      <Link
        href="/store"
        className="note inline-flex min-h-11 items-center gap-2 hover:text-white"
      >
        <ArrowLeft size={14} strokeWidth={2} />
        back to store
      </Link>
      <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <h1 className="mark text-[clamp(3rem,7vw,5.5rem)] text-white">
          {category.name}
        </h1>
        <span className="note tabular-nums">
          {matching.length} {matching.length === 1 ? "resource" : "resources"}
        </span>
      </div>
      <p className="mt-5 max-w-xl text-base leading-7 text-[var(--neutral-400)]">
        {category.description}
      </p>
      <div className="mt-12">
        <ProductGrid products={matching} />
      </div>
    </div>
  );
}
