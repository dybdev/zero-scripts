import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="content-shell px-4 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-bold tracking-[0.18em] text-[var(--brand-red-light)] uppercase">
          404 / Resource missing
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.05em] text-white">
          This page is off the grid.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[var(--neutral-400)]">
          The resource may have moved, or the address is incomplete.
        </p>
        <Link href="/store" className="button-primary mt-7">
          <ArrowLeft size={16} strokeWidth={2.2} />
          Return to store
        </Link>
      </div>
    </div>
  );
}
