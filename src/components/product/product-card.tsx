import Link from "next/link";
import { ArrowUpRight, Tag } from "lucide-react";

import type { Product } from "@/lib/tebex/types";
import { cn } from "@/lib/utils";

import { AddToBasketButton } from "./add-to-basket-button";
import { CompatibilityBadge } from "./compatibility-badge";
import { ProductArtwork } from "./product-artwork";
import { ProductPrice } from "./product-price";

export function ProductCard({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  return (
    <article className="product-card group flex min-w-0 transform-gpu flex-col overflow-hidden rounded-[14px] border border-white/8 bg-[#151515] shadow-[0_8px_24px_rgba(0,0,0,0)] transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform hover:-translate-y-1 hover:border-white/16 hover:shadow-[0_24px_64px_rgba(0,0,0,.32)]">
      <Link
        href={`/store/package/${product.slug}`}
        className={cn(
          "relative overflow-hidden bg-[#101010] focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:outline-none focus-visible:ring-inset",
          large ? "aspect-[1.55/1]" : "aspect-[1.45/1]",
        )}
      >
        <ProductArtwork
          product={product}
          className="h-full w-full transform-gpu transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] will-change-transform group-hover:scale-[1.025]"
        />
      </Link>
      <div className={cn("flex flex-1 flex-col", large ? "p-6" : "p-5")}>
        <Link
          href={`/store/package/${product.slug}`}
          className="flex items-start justify-between gap-3 rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:outline-none"
        >
          <h3
            className={cn(
              "font-bold tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-[var(--brand-red-light)]",
              large ? "text-xl" : "text-lg",
            )}
          >
            {product.name}
          </h3>
          <ArrowUpRight
            size={16}
            strokeWidth={2}
            className="mt-0.5 shrink-0 text-[#666] transition-[color,transform] duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
          />
        </Link>
        <div className="mt-5 flex flex-wrap gap-2">
          {product.compatibility.map((framework) => (
            <CompatibilityBadge key={framework} label={framework} />
          ))}
        </div>
        <div className="mt-auto pt-6">
          <p className="text-sm font-semibold text-[var(--neutral-400)]">
            Price
          </p>
          <div className="mt-2 flex items-center gap-2 text-[var(--brand-red-light)]">
            <Tag size={23} strokeWidth={2.2} aria-hidden />
            <ProductPrice
              amount={product.price}
              currency={product.currency}
              className="text-2xl"
            />
          </div>
          <AddToBasketButton
            product={product}
            fullLabel
            className="button-solid-red mt-5 w-full"
          />
        </div>
      </div>
    </article>
  );
}
