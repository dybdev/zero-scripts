"use client";

import { MotionConfig } from "motion/react";

/**
 * One motion language for the whole storefront: a short ease-out curve and
 * no motion at all for visitors who ask the OS for reduced motion.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
