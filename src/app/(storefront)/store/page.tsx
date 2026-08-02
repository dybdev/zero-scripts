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
    <div className="content-shell px-4 pt-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold tracking-[0.16em] text-[var(--brand-red-light)] uppercase">
            Catalogue
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-white sm:text-4xl">
            Production-ready resources
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--neutral-400)]">
            Explore focused systems for gameplay, operations, racing, and
            framework integration.
          </p>
        </div>
        <p className="mt-4 text-xs font-semibold text-[#777] tabular-nums">
          {filtered.length} {filtered.length === 1 ? "resource" : "resources"}
        </p>
      </div>
      <div id="categories" className="mt-8 scroll-mt-28">
        <CatalogueControls
          categories={categories}
          initial={{ query, category }}
        />
      </div>
      <div className="mt-6">
        {!category ? (
          <div className="space-y-12">
            {Array.from(groupedProducts.entries()).map(
              ([groupName, groupProducts]) => (
                <section
                  key={groupName}
                  aria-labelledby={`group-${groupProducts[0].categorySlug}`}
                >
                  <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/8 pb-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.16em] text-[var(--brand-red-light)] uppercase">
                        Resource type
                      </p>
                      <h2
                        id={`group-${groupProducts[0].categorySlug}`}
                        className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-white sm:text-2xl"
                      >
                        {groupName}
                      </h2>
                    </div>
                    <p className="text-xs font-semibold text-[#777] tabular-nums">
                      {groupProducts.length}{" "}
                      {groupProducts.length === 1 ? "resource" : "resources"}
                    </p>
                  </div>
                  <ProductGrid products={groupProducts} showCategoryLabels />
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
