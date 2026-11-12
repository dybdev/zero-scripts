"use client";

import { Search } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Category } from "@/lib/tebex/types";
import { cn } from "@/lib/utils";

export function CatalogueControls({
  categories,
  initial,
}: {
  categories: Category[];
  initial: { query: string; category: string };
}) {
  const router = useRouter();

  const categoryHref = (category: string) => {
    const params = new URLSearchParams();
    if (initial.query) params.set("q", initial.query);
    if (category) params.set("category", category);
    return `/store${params.size ? `?${params.toString()}` : ""}`;
  };

  const tabs = [{ slug: "", name: "All" }, ...categories];

  return (
    <div className="flex flex-col gap-5 border-b border-[var(--line)] md:flex-row md:items-end md:justify-between">
      <nav
        aria-label="Product categories"
        className="-mb-px flex gap-1 overflow-x-auto"
      >
        {tabs.map((tab) => {
          const active = initial.category === tab.slug;
          return (
            <Link
              key={tab.slug || "all"}
              href={categoryHref(tab.slug)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "nav-link shrink-0 pb-1",
                active && "nav-link-active",
              )}
            >
              {tab.name}
              {active ? (
                <motion.span
                  layoutId="category-underline"
                  className="absolute inset-x-[0.9rem] bottom-0 h-[2px] bg-[var(--brand-red)]"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <form
        className="relative mb-4 w-full md:w-80"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const query = String(data.get("q") ?? "").trim();
          const params = new URLSearchParams();
          if (query) params.set("q", query);
          if (initial.category) params.set("category", initial.category);
          router.push(`/store${params.size ? `?${params.toString()}` : ""}`);
        }}
      >
        <label htmlFor="catalogue-search" className="sr-only">
          Search products
        </label>
        <Search
          size={16}
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[var(--neutral-400)]"
        />
        <input
          id="catalogue-search"
          name="q"
          type="search"
          defaultValue={initial.query}
          placeholder="search resources"
          className="field h-11 w-full pr-4! pl-10!"
        />
      </form>
    </div>
  );
}
