"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useOverlay } from "@/hooks/use-overlay";
import type { Product } from "@/lib/tebex/types";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const close = useCallback(() => onClose(), [onClose]);
  const ref = useOverlay(open, close);
  const {
    data: products = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["tebex", "packages", "search"],
    queryFn: async () => {
      const response = await fetch("/api/tebex/packages");
      const body = (await response.json()) as {
        data?: Product[];
        message?: string;
      };
      if (!response.ok || !body.data) {
        throw new Error(body.message ?? "Unable to load the catalogue.");
      }
      return body.data;
    },
    enabled: open,
    staleTime: 60_000,
  });
  const results = useMemo(() => {
    if (!query.trim()) return products.slice(0, 4);
    const needle = query.toLowerCase();
    return products
      .filter((product) =>
        [product.name, product.category, product.description]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
      .slice(0, 6);
  }, [products, query]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-80 bg-black/70"
            aria-label="Close search"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-title"
            className="fixed top-[8vh] left-1/2 z-90 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 overflow-hidden rounded-[6px] border border-white/10 bg-[#151515]/98 shadow-2xl"
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.16 }}
          >
            <h2 id="search-title" className="sr-only">
              Search resources
            </h2>
            <div className="flex items-center gap-3 border-b border-white/8 px-4">
              <Search
                size={20}
                strokeWidth={2}
                className="shrink-0 text-[#777]"
              />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search resources and categories..."
                className="h-16 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#666]"
              />
              <button
                type="button"
                onClick={close}
                className="icon-button"
                aria-label="Close search"
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <p className="px-3 py-2 text-[10px] font-bold tracking-[0.14em] text-[#777] uppercase">
                {query ? "Results" : "Popular resources"}
              </p>
              {isLoading ? (
                <p className="px-3 py-8 text-center text-sm text-[#888]">
                  Loading live resources...
                </p>
              ) : isError ? (
                <p className="px-3 py-8 text-center text-sm text-[#b98d88]">
                  Live search is temporarily unavailable. Please browse the
                  store instead.
                </p>
              ) : results.length ? (
                results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/store/package/${product.slug}`}
                    onClick={close}
                    className="flex min-h-14 items-center justify-between gap-4 rounded-[3px] px-3 py-2 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:outline-none"
                  >
                    <span>
                      <span className="block text-sm font-bold text-white">
                        {product.name}
                      </span>
                      <span className="text-xs text-[#777]">
                        {product.category}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-[var(--brand-red-light)] tabular-nums">
                      {product.price === 0
                        ? "Free"
                        : `$${product.price.toFixed(2)}`}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="px-3 py-8 text-center text-sm text-[#888]">
                  No resources match &quot;{query}&quot;.
                </p>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
