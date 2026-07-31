import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function ZeroLogo({
  variant = "banner",
  className,
}: {
  variant?: "banner" | "symbol";
  className?: string;
}) {
  const symbol = variant === "symbol";
  return (
    <Link
      href="/"
      aria-label="Zero Scripts home"
      className={cn(
        "inline-flex shrink-0 items-center focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:outline-none",
        symbol ? "size-12" : "w-44",
        className,
      )}
    >
      <Image
        src={
          symbol
            ? "/brand/logo-symbol.png"
            : "/brand/zero-scripts-lockup.png"
        }
        alt="Zero Scripts"
        width={symbol ? 471 : 1619}
        height={symbol ? 474 : 498}
        priority
        className={
          symbol
            ? "size-full object-contain"
            : "h-auto w-full object-contain"
        }
      />
    </Link>
  );
}
