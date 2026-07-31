"use client";

import Link from "next/link";
import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { BuyerIdentity } from "@/lib/tebex/types";

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

const currencies = ["USD", "EUR", "GBP", "CAD"] as const;

export function SiteHeader({ buyer = null }: { buyer?: BuyerIdentity | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { requestSignIn } = useBuyerAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [currency, setCurrency] = useState<(typeof currencies)[number]>("USD");
  const currencyRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeCurrency = (event: MouseEvent) => {
      if (!currencyRef.current?.contains(event.target as Node)) {
        setCurrencyOpen(false);
      }
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCurrencyOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", closeCurrency);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeCurrency);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-3 z-50 px-3 transition-transform duration-200 sm:top-4 sm:px-5",
          scrolled ? "translate-y-0" : "translate-y-0",
        )}
      >
        <div className="content-shell relative flex h-[72px] items-center gap-3">
          <button
            type="button"
            className="icon-button xl:hidden!"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} strokeWidth={2.2} />
          </button>
          <div className="hidden sm:block">
            <ZeroLogo variant="banner" className="w-40 xl:w-44" />
          </div>
          <div className="sm:hidden">
            <ZeroLogo variant="symbol" />
          </div>
          <nav
            aria-label="Primary navigation"
            className={cn(
              "nav-surface absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 xl:flex",
              scrolled && "bg-[#151515]/82",
            )}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link",
                  pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(`${item.href}/`))
                    ? "nav-link-active"
                    : "",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div ref={currencyRef} className="relative hidden md:block">
              <button
                type="button"
                className="header-action header-surface min-w-[86px]"
                aria-haspopup="listbox"
                aria-expanded={currencyOpen}
                onClick={() => setCurrencyOpen((open) => !open)}
              >
                <span className="text-sm font-semibold">{currency}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={2.2}
                  className={cn(
                    "transition-transform duration-200",
                    currencyOpen && "rotate-180",
                  )}
                />
              </button>
              {currencyOpen ? (
                <div
                  role="listbox"
                  aria-label="Select currency"
                  className="header-surface absolute top-[calc(100%+.5rem)] right-0 w-28 overflow-hidden p-1.5"
                >
                  {currencies.map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={currency === option}
                      className={cn(
                        "flex min-h-10 w-full items-center rounded-lg px-3 text-sm font-semibold transition-colors hover:bg-[var(--brand-red)] hover:text-white",
                        currency === option
                          ? "text-[var(--brand-red-light)]"
                          : "text-[#aaa]",
                      )}
                      onClick={() => {
                        setCurrency(option);
                        setCurrencyOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {buyer ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  className="header-action header-surface"
                  aria-label={`Menu for ${buyer.displayName}`}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  <span className="grid size-7 place-items-center rounded-full bg-[var(--brand-red)] text-xs font-bold text-white uppercase">
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
                    className="header-surface absolute top-[calc(100%+.5rem)] right-0 w-48 overflow-hidden p-1.5"
                  >
                    <a
                      href={
                        process.env.NEXT_PUBLIC_DISCORD_URL ?? "/support"
                      }
                      role="menuitem"
                      className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#bbb] transition-colors hover:bg-[#222] hover:text-white"
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
                      className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#bbb] transition-colors hover:bg-[var(--brand-red)] hover:text-white"
                      onClick={async () => {
                        await fetch("/api/tebex/auth", {
                          method: "DELETE",
                        });
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
                className="header-action header-surface button-solid-red"
                aria-label="Sign in"
                onClick={requestSignIn}
              >
                <LogIn size={19} strokeWidth={2.2} />
                <span className="hidden text-sm font-semibold sm:inline">
                  Sign In
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
