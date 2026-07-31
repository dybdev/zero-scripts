"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCallback } from "react";

import { useOverlay } from "@/hooks/use-overlay";

import { ZeroLogo } from "../brand/zero-logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/documentation", label: "Documentation" },
  { href: "/support", label: "Support" },
];

export function MobileNavigation({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const close = useCallback(() => onClose(), [onClose]);
  const ref = useOverlay(open, close);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm xl:hidden"
            aria-label="Close navigation"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.nav
            ref={ref}
            aria-label="Mobile navigation"
            className="fixed top-0 left-0 z-70 flex h-dvh w-[min(88vw,360px)] flex-col border-r border-white/10 bg-[#111]/97 p-5 backdrop-blur-2xl xl:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <ZeroLogo variant="banner" />
              <button
                type="button"
                className="icon-button"
                onClick={close}
                aria-label="Close navigation"
              >
                <X size={19} strokeWidth={2.2} />
              </button>
            </div>
            <div className="mt-10 flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="border-b border-white/7 py-4 text-lg font-bold tracking-[-0.02em] text-white hover:text-[var(--brand-red-light)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="mt-auto text-xs leading-5 text-[#777]">
              Premium FiveM resources, maintained for production servers.
            </p>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
