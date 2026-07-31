"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Category } from "@/lib/tebex/types";

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

  return (
    <div className="space-y-7">
      <nav
        aria-label="Product categories"
        className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible"
      >
        <Link
          href={categoryHref("")}
          className={
            initial.category
              ? "button-secondary min-h-11 shrink-0"
              : "button-primary min-h-11 shrink-0"
          }
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={categoryHref(category.slug)}
            className={
              initial.category === category.slug
                ? "button-primary min-h-11 shrink-0"
                : "button-secondary min-h-11 shrink-0"
            }
          >
            {category.name}
          </Link>
        ))}
      </nav>

      <form
        className="relative w-full sm:w-[calc((100%-1.25rem)/2)] xl:w-[calc((100%-2.5rem)/3)]"
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
          size={17}
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--brand-red-light)]"
        />
        <input
          id="catalogue-search"
          name="q"
          type="search"
          defaultValue={initial.query}
          placeholder="Search resources..."
          className="field h-12 w-full pr-4! pl-11!"
        />
      </form>
    </div>
  );
}
