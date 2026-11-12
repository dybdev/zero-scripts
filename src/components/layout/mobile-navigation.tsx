"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-60 bg-black/75 xl:hidden"
            aria-label="Close navigation"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.nav
            ref={ref}
            aria-label="Mobile navigation"
            className="fixed top-0 left-0 z-70 flex h-dvh w-[min(88vw,380px)] flex-col border-r border-[var(--line-strong)] bg-[var(--surface)] p-5 xl:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
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
            <motion.ol
              className="mt-12 flex flex-col"
              initial="hidden"
              animate="shown"
              variants={{
                hidden: {},
                shown: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.12 },
                },
              }}
            >
              {links.map((link, index) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      shown: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className="flex items-baseline gap-4 border-b border-[var(--line)] py-4"
                    >
                      <span className="index text-xs">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={
                          active
                            ? "font-display mark text-4xl text-white"
                            : "font-display text-4xl text-[var(--neutral-400)] transition-colors hover:text-white"
                        }
                      >
                        {link.label}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ol>
            <p className="note mt-auto">
              premium fivem resources, maintained for production servers.
            </p>
          </motion.nav>
        </>
      ) : null}
    </AnimatePresence>
  );
}
