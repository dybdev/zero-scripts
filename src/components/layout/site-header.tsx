"use client";

import Link from "next/link";
import { ChevronDown, LogIn, LogOut, Menu, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { BuyerIdentity } from "@/lib/tebex/types";
import { useBasketStore } from "@/stores/basket-store";

import { useBuyerAuth } from "../account/auth-provider";
import { ZeroLogo } from "../brand/zero-logo";
import { BasketButton } from "../basket/basket-button";
import { MobileNavigation } from "./mobile-navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/documentation", label: "Documentation" },
  { href: "/support", label: "Support" },
];

export function SiteHeader({ buyer = null }: { buyer?: BuyerIdentity | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { requestSignIn } = useBuyerAuth();
  const clearBasket = useBasketStore((state) => state.clear);
  const closeBasket = useBasketStore((state) => state.close);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeAccount = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", closeAccount);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeAccount);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b px-3 transition-[background-color,border-color] duration-300 sm:px-5",
          scrolled
            ? "border-[var(--line)] bg-[var(--background)]/95"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="content-shell relative flex h-[76px] items-center gap-3 sm:px-1 lg:px-3">
          <button
            type="button"
            className="icon-button xl:hidden!"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
          <div className="hidden sm:block">
            <ZeroLogo variant="banner" className="w-36 xl:w-40" />
          </div>
          <div className="sm:hidden">
            <ZeroLogo variant="symbol" />
          </div>
          <nav
            aria-label="Primary navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center xl:flex"
          >
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ||
                (item.href !== "/" && pathname === item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("nav-link", active && "nav-link-active")}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-[0.9rem] bottom-1.5 h-[2px] bg-[var(--brand-red)]"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 36,
                      }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="note hidden px-2 md:inline"
              title="Prices are listed in USD. Tebex may localize currency at checkout."
            >
              usd
            </span>
            {buyer ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  className="header-action"
                  aria-label={`Menu for ${buyer.displayName}`}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  <span className="grid size-7 place-items-center rounded-[3px] bg-[var(--brand-red)] text-xs font-bold text-white uppercase">
                    {buyer.displayName.charAt(0)}
                  </span>
                  <span className="hidden max-w-32 truncate text-sm font-semibold sm:inline">
                    {buyer.displayName}
                  </span>
                  <ChevronDown
                    size={16}
                    strokeWidth={2.2}
                    className={cn(
                      "transition-transform duration-200",
                      accountOpen && "rotate-180",
                    )}
                  />
                </button>
                {accountOpen ? (
                  <div
                    role="menu"
                    className="header-surface absolute top-[calc(100%+.5rem)] right-0 w-48 overflow-hidden border border-[var(--line-strong)] p-1"
                  >
                    <a
                      href={process.env.NEXT_PUBLIC_DISCORD_URL ?? "/support"}
                      role="menuitem"
                      className="flex min-h-11 items-center gap-3 rounded-[3px] px-3 text-sm font-medium text-[var(--neutral-200)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-white"
                      onClick={() => setAccountOpen(false)}
                    >
                      <MessageCircle
                        size={18}
                        strokeWidth={2}
                        className="text-[var(--brand-red-light)]"
                      />
                      Discord
                    </a>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex min-h-11 w-full items-center gap-3 rounded-[3px] px-3 text-sm font-medium text-[var(--neutral-200)] transition-colors hover:bg-[var(--brand-red)] hover:text-white"
                      onClick={async () => {
                        clearBasket();
                        closeBasket();
                        window.sessionStorage.removeItem(
                          "zero_pending_product",
                        );
                        await Promise.all([
                          fetch("/api/tebex/auth", { method: "DELETE" }),
                          fetch("/api/auth/discord", { method: "DELETE" }),
                        ]);
                        setAccountOpen(false);
                        router.push("/");
                        router.refresh();
                      }}
                    >
                      <LogOut size={18} strokeWidth={2} />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                className="header-action button-solid-red"
                aria-label="Sign in"
                onClick={requestSignIn}
              >
                <LogIn size={19} strokeWidth={2.2} />
                <span className="font-display hidden text-[0.95rem] tracking-[0.04em] sm:inline">
                  Sign in
                </span>
              </button>
            )}
            <BasketButton />
          </div>
        </div>
      </header>
      <MobileNavigation
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
