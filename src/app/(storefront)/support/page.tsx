import type { Metadata } from "next";
import Link from "next/link";
import {
  CircleCheck,
  ExternalLink,
  LifeBuoy,
  Mail,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get installation and product support for Zero Scripts resources.",
};

const checklist = [
  "Confirm your resource and dependency versions",
  "Reproduce with a focused, readable console log",
  "Remove any private keys, tokens, and player data",
  "Note your framework and relevant configuration changes",
];

export default function SupportPage() {
  return (
    <div className="content-shell px-4 pt-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="inline-flex min-h-8 items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 text-[11px] font-bold text-[#bbb]">
          <LifeBuoy
            size={15}
            strokeWidth={2}
            className="text-[var(--brand-red-light)]"
          />
          Product and setup support
        </div>
        <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
          Let’s get your server moving.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--neutral-400)]">
          Start with the documentation for setup and integration questions. For
          product-specific issues, use a support channel and include the details
          below so we can respond with context.
        </p>
      </div>

      <div className="mt-12 grid border-y border-white/8 lg:grid-cols-2">
        <div className="border-b border-white/8 py-8 lg:border-r lg:border-b-0 lg:pr-10">
          <MessageCircle
            size={26}
            strokeWidth={1.8}
            className="text-[var(--brand-red-light)]"
          />
          <h2 className="mt-5 text-xl font-bold text-white">
            Community support
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--neutral-400)]">
            Best for configuration questions, known issues, and guidance from
            other server developers.
          </p>
          <Link href="/documentation" className="button-primary mt-6">
            Troubleshooting guide
            <ExternalLink size={16} strokeWidth={2.2} />
          </Link>
        </div>
        <div className="py-8 lg:pl-10">
          <Mail
            size={26}
            strokeWidth={1.8}
            className="text-[var(--brand-red-light)]"
          />
          <h2 className="mt-5 text-xl font-bold text-white">
            Purchase assistance
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--neutral-400)]">
            For receipt, access, or account questions, contact support from the
            email associated with your Tebex purchase.
          </p>
        </div>
      </div>

      <section className="mt-16 rounded-[14px] border border-white/8 bg-[#151515] p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white">
          Before opening a request
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {checklist.map((item) => (
            <div key={item} className="flex gap-3">
              <CircleCheck
                size={18}
                strokeWidth={2.2}
                className="mt-0.5 shrink-0 text-[var(--brand-red-light)]"
              />
              <p className="text-sm leading-6 text-[var(--neutral-400)]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
