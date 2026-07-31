import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Braces,
  Cable,
  Download,
  Settings,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Setup, configuration, integration, and upgrade guidance for Zero Scripts resources.",
};

const steps = [
  {
    icon: Download,
    title: "Install the resource",
    description:
      "Download from your Tebex account, preserve the package name, and place the resource in a dedicated server folder.",
  },
  {
    icon: Settings,
    title: "Review configuration",
    description:
      "Configure framework, permissions, locale, and optional integrations from the supplied defaults.",
  },
  {
    icon: Cable,
    title: "Start dependencies first",
    description:
      "Follow the documented dependency order before adding the Zero resource to your server configuration.",
  },
];

export default function DocumentationPage() {
  return (
    <div className="content-shell px-4 pt-16 sm:px-6 lg:px-8">
      <header className="site-grid border-y border-white/7 py-16 text-center">
        <BookOpenText
          size={30}
          strokeWidth={1.8}
          className="mx-auto text-[var(--brand-red-light)]"
        />
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl leading-tight font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
          Clear setup from first install to every update.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--neutral-400)]">
          This overview covers the shared installation path. Each purchase
          includes product-specific configuration, exports, framework notes, and
          a versioned changelog.
        </p>
      </header>

      <section className="mt-20">
        <p className="text-xs font-bold tracking-[0.16em] text-[var(--brand-red-light)] uppercase">
          Common installation path
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-[-0.035em] text-white">
          Start with the right order
        </h2>
        <div className="mt-7 grid border-t border-white/8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="border-r border-b border-white/8 px-1 py-7 pr-7 md:px-6"
            >
              <div className="flex items-center justify-between">
                <Icon
                  size={22}
                  strokeWidth={2}
                  className="text-[var(--brand-red-light)]"
                />
                <span className="text-xs font-bold text-[#666] tabular-nums">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-base font-bold text-white">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-[var(--neutral-400)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 grid border-y border-white/8 lg:grid-cols-2">
        <div className="border-b border-white/8 py-9 lg:border-r lg:border-b-0 lg:pr-10">
          <Braces
            size={22}
            strokeWidth={2}
            className="text-[var(--brand-red-light)]"
          />
          <h2 className="mt-4 text-lg font-bold text-white">
            Compatibility baseline
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--neutral-400)]">
            <li>• Current FiveM artifacts with OneSync enabled</li>
            <li>• Qbox, QBCore, ESX, or standalone as listed</li>
            <li>• Dependency versions shown on the product page</li>
            <li>• Server access sufficient to install and restart resources</li>
          </ul>
        </div>
        <div className="py-9 lg:pl-10">
          <h2 className="text-lg font-bold text-white">Need product help?</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--neutral-400)]">
            Include the resource version, framework, dependency versions, and a
            focused console excerpt when contacting support.
          </p>
          <Link href="/support" className="button-primary mt-6">
            Open support
            <ArrowRight size={16} strokeWidth={2.2} />
          </Link>
        </div>
      </section>
    </div>
  );
}
