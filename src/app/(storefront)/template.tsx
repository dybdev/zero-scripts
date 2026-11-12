"use client";

import { motion } from "motion/react";
import { useEffect } from "react";

// The first page a visitor lands on renders straight away (good for the
// first paint); every navigation after that gets the transition.
let hasNavigated = false;

/**
 * Route transition. Templates re-mount on every navigation, so each page
 * settles in with a short fade and a small rise instead of snapping in.
 */
export default function StorefrontTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const animate = hasNavigated;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
