"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Loading state: the mark, what is loading, and one thin red bar that runs
 * while the request is open. No glow, no spinning logo.
 */
export function ZeroLoader({
  label = "Fetching data",
  fullScreen = false,
  className,
}: {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "flex items-center justify-center",
        fullScreen && "min-h-[calc(100svh-96px)] px-6",
        className,
      )}
    >
      <div className="flex w-48 flex-col items-center">
        <div className="relative size-12">
          <Image
            src="/brand/logo-symbol.png"
            alt=""
            fill
            priority
            sizes="48px"
            className="object-contain"
          />
        </div>
        <div className="mt-6 h-[2px] w-full overflow-hidden bg-[var(--line)]">
          <motion.div
            className="h-full w-1/3 bg-[var(--brand-red)]"
            initial={{ x: "-100%" }}
            animate={{ x: "300%" }}
            transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
        <p className="note mt-4 lowercase">{label}</p>
      </div>
    </div>
  );
}
