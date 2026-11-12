"use client";

import { CircleAlert } from "lucide-react";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="content-shell px-4 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-[6px] border border-white/8 bg-[#151515] p-8 text-center">
        <CircleAlert
          size={34}
          strokeWidth={1.8}
          className="text-[var(--brand-red-light)]"
        />
        <h1 className="mt-5 text-xl font-bold text-white">
          The catalogue did not load
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--neutral-400)]">
          The storefront could not reach its data source. Try the request again.
        </p>
        <button type="button" onClick={reset} className="button-primary mt-6">
          Try again
        </button>
      </div>
    </div>
  );
}
