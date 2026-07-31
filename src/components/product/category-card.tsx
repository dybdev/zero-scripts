import Link from "next/link";
import {
  Box,
  Braces,
  Flag,
  Gamepad2,
  PanelsTopLeft,
  ShieldCheck,
} from "lucide-react";

import type { Category } from "@/lib/tebex/types";

const icons = {
  code: Braces,
  cube: Box,
  game: Gamepad2,
  flag: Flag,
  shield: ShieldCheck,
  layout: PanelsTopLeft,
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = icons[category.icon];
  return (
    <Link
      href={`/store/category/${category.slug}`}
      className="group flex min-h-40 flex-col border-r border-b border-white/8 p-5 transition-colors duration-200 hover:bg-white/[0.025] focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:outline-none"
    >
      <div className="flex items-start justify-between">
        <Icon
          size={23}
          strokeWidth={2}
          className="text-[var(--brand-red-light)]"
        />
        <span className="text-xs font-semibold text-[#777] tabular-nums">
          {category.productCount.toString().padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-auto text-base font-bold text-white">
        {category.name}
      </h3>
      <p className="mt-1 text-xs leading-5 text-[var(--neutral-400)]">
        {category.description}
      </p>
    </Link>
  );
}
