import type { Product } from "@/lib/tebex/types";

import { EmptyState } from "../ui/empty-state";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  layout = "featured",
}: {
  products: Product[];
  layout?: "catalogue" | "featured";
}) {
  if (!products.length) return <EmptyState />;
  return (
    <div
      className={
        layout === "featured"
          ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      }
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          large={layout === "featured"}
        />
      ))}
    </div>
  );
}
