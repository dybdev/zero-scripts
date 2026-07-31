import Link from "next/link";
import { Package } from "lucide-react";

export function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your search or filters.",
  action,
}: {
  title?: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="col-span-full flex min-h-72 flex-col items-center justify-center rounded-[14px] border border-dashed border-white/10 bg-white/[0.018] px-6 text-center">
      <Package size={30} strokeWidth={1.8} className="text-[#777]" />
      <h2 className="mt-4 text-lg font-bold text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--neutral-400)]">
        {description}
      </p>
      {action ? (
        <Link href={action.href} className="button-secondary mt-5">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
