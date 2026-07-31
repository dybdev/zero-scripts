import Link from "next/link";
import { Code2, MessageCircle, ShieldCheck } from "lucide-react";

import { ZeroLogo } from "../brand/zero-logo";

const groups = [
  {
    title: "Store",
    links: [
      { label: "All resources", href: "/store" },
      { label: "Featured", href: "/store?sort=featured" },
      { label: "New releases", href: "/store?sort=newest" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Refund policy", href: "/terms#refunds" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/8 bg-[#090909]">
      <div className="content-shell px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <ZeroLogo variant="banner" className="w-40" />
            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--neutral-400)]">
              Performance-first FiveM resources for teams that care about
              maintainable servers.
            </p>
            <div className="mt-5 flex gap-2">
              <Link
                href="/support"
                className="icon-button"
                aria-label="Community support"
              >
                <MessageCircle size={19} strokeWidth={2} />
              </Link>
              <Link
                href="/documentation"
                className="icon-button"
                aria-label="Developer documentation"
              >
                <Code2 size={19} strokeWidth={2} />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-xs font-bold text-white">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-[var(--neutral-400)] hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/7 pt-6 text-[11px] text-[#707070] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Zero Scripts. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} strokeWidth={2} />
            <span>Secure checkout and payments provided by Tebex.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
