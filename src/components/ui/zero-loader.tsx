"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export function ZeroLoader({
  label = "Fetching data",
  fullScreen = false,
  className,
}: {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

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
      <div className="flex flex-col items-center">
        <div className="relative grid size-24 place-items-center sm:size-28">
          <motion.div
            aria-hidden="true"
            className="absolute inset-2 rounded-full bg-[var(--brand-red)]/20 blur-2xl"
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.25, 0.7, 0.25], scale: [0.8, 1.12, 0.8] }
            }
            transition={{
              duration: 1.6,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <motion.div
            aria-hidden="true"
            className="relative size-16 sm:size-20"
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: 360,
                  }
            }
            transition={{
              duration: 1.4,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <Image
              src="/brand/logo-symbol.png"
              alt=""
              fill
              priority
              sizes="80px"
              className="object-contain"
            />
          </motion.div>
        </div>

        <p className="mt-4 text-xs font-bold tracking-[0.18em] text-white uppercase">
          {label}
          <span aria-hidden="true" className="inline-flex w-6">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
                transition={{
                  delay: index * 0.2,
                  duration: 1.2,
                  repeat: Infinity,
                }}
              >
                .
              </motion.span>
            ))}
          </span>
        </p>
        <span className="mt-2 text-[0.6875rem] tracking-[0.08em] text-[var(--neutral-400)] uppercase">
          Zero Scripts
        </span>
      </div>
    </div>
  );
}
