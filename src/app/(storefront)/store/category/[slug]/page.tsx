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
        className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-[#999] hover:text-white"
      >
        <ArrowLeft size={15} strokeWidth={2.2} />
        Back to store
      </Link>
      <p className="mt-8 text-xs font-bold tracking-[0.16em] text-[var(--brand-red-light)] uppercase">
        Category
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-4xl">
        {category.name}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--neutral-400)]">
        {category.description}
      </p>
      <div className="mt-8">
        <ProductGrid products={matching} />
      </div>
    </div>
  );
}
