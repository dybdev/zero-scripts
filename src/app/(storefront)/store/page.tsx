import type { Metadata } from "next";

import { CatalogueControls } from "@/components/catalogue/catalogue-controls";
import { ProductGrid } from "@/components/product/product-grid";
import { getCatalogueAdapter } from "@/lib/tebex/client";
import type { Product } from "@/lib/tebex/types";

const categoryOrder = ["escrowed", "open-source"];

function categoryRank(product: Product) {
  const rank = categoryOrder.indexOf(product.categorySlug);
  return rank === -1 ? categoryOrder.length : rank;
}

function catalogueSort(a: Product, b: Product) {
  return (
    categoryRank(a) - categoryRank(b) ||
    a.category.localeCompare(b.category) ||
    a.name.localeCompare(b.name)
  );
}

export const metadata: Metadata = {
  title: "Store",
  description:
    "Browse performance-first FiveM resources for Qbox, QBCore, ESX, and standalone servers.",
};

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const category = params.category ?? "";
  const adapter = getCatalogueAdapter();
  const [products, categories] = await Promise.all([
    adapter.getPackages(),
    adapter.getCategories(),
  ]);
  const needle = query.toLowerCase();
  const filtered = products
    .filter((product) => {
      const matchesQuery =
        !needle ||
        [product.name, product.category, product.description]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesCategory = !category || product.categorySlug === category;
      return matchesQuery && matchesCategory;
    })
    .sort(catalogueSort);

  const groupedProducts = filtered.reduce<Map<string, Product[]>>(
    (groups, product) => {
      const group = groups.get(product.category) ?? [];
      group.push(product);
      groups.set(product.category, group);
      return groups;
    },
    new Map(),
  );

  return (
    <div className="content-shell px-4 pt-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <h1 className="mark text-[clamp(3rem,7vw,5.5rem)] text-white">Store</h1>
        <span className="note tabular-nums">
          {filtered.length} {filtered.length === 1 ? "resource" : "resources"}
          {query ? ` matching "${query}"` : ""}
        </span>
      </div>
      <p className="mt-5 max-w-xl text-base leading-7 text-[var(--neutral-400)]">
        Gameplay, survival, operations and framework systems for FiveM servers.
      </p>
      <div id="categories" className="mt-10 scroll-mt-28">
        <CatalogueControls
          categories={categories}
          initial={{ query, category }}
        />
      </div>
      <div className="mt-10">
        {!category ? (
          <div className="space-y-20">
            {Array.from(groupedProducts.entries()).map(
              ([groupName, groupProducts], groupIndex) => (
                <section
                  key={groupName}
                  aria-labelledby={`group-${groupProducts[0].categorySlug}`}
                >
                  <div className="mb-6 flex items-baseline gap-4">
                    <span className="index text-sm">
                      {String(groupIndex + 1).padStart(2, "0")}
                    </span>
                    <h2
                      id={`group-${groupProducts[0].categorySlug}`}
                      className="text-4xl text-white"
                    >
                      {groupName}
                    </h2>
                    <span className="note tabular-nums">
                      {groupProducts.length}{" "}
                      {groupProducts.length === 1 ? "resource" : "resources"}
                    </span>
                  </div>
                  <ProductGrid products={groupProducts} />
                </section>
              ),
            )}
          </div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>
    </div>
  );
}
