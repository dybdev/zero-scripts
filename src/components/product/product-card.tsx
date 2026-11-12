import Link from "next/link";

import type { Product } from "@/lib/tebex/types";
import { cn } from "@/lib/utils";

import { AddToBasketButton } from "./add-to-basket-button";
import { ProductArtwork } from "./product-artwork";
import { ProductPrice } from "./product-price";

export function ProductCard({
  product,
  large = false,
  showCategoryLabel = false,
}: {
  product: Product;
  large?: boolean;
  showCategoryLabel?: boolean;
}) {
  const href = `/store/package/${product.slug}`;

  return (
    <article className="product-card group flex min-w-0 flex-col overflow-hidden">
      <Link
        href={href}
        className={cn(
          "relative block overflow-hidden bg-[var(--background)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--foreground)]",
          large ? "aspect-[1.5/1]" : "aspect-[1.4/1]",
        )}
      >
        <ProductArtwork
          product={product}
          className="product-card-image h-full w-full"
        />
      </Link>
      <div
        className={cn(
          "flex flex-1 flex-col border-t border-[var(--line)]",
          large ? "p-6" : "p-5",
        )}
      >
        {showCategoryLabel ? (
          <p className="note lowercase">{product.category}</p>
        ) : null}
        <h3
          className={cn(
            "text-white",
            showCategoryLabel && "mt-2",
            large ? "text-[1.85rem]" : "text-[1.6rem]",
          )}
        >
          <Link
            href={href}
            className="link-draw focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]"
          >
            {product.name}
          </Link>
        </h3>
        {product.compatibility.length ? (
          <p className="note mt-3 lowercase">
            {product.compatibility.join(" / ")}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-4 pt-7">
          <ProductPrice
            amount={product.price}
            currency={product.currency}
            className="text-lg"
          />
          <AddToBasketButton
            product={product}
            fullLabel
            className="button-secondary min-h-11 px-4"
          />
        </div>
      </div>
    </article>
  );
}
