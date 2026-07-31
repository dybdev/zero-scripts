import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <article className="content-shell px-4 pt-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold tracking-[0.16em] text-[var(--brand-red-light)] uppercase">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-white">
          Terms of sale
        </h1>
        <div className="mt-8 space-y-8 text-sm leading-7 text-[var(--neutral-400)]">
          <section>
            <h2 className="text-lg font-bold text-white">Digital licenses</h2>
            <p className="mt-2">
              Each purchase grants a limited, non-transferable license to use
              the resource for the server scope shown at checkout. Source,
              credentials, and licensed files must not be redistributed.
            </p>
          </section>
          <section id="refunds" className="scroll-mt-28">
            <h2 className="text-lg font-bold text-white">Refunds</h2>
            <p className="mt-2">
              Digital purchases are reviewed under the policy presented by Tebex
              at checkout and applicable consumer law. Contact support with the
              transaction reference before initiating a dispute.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Service availability
            </h2>
            <p className="mt-2">
              Supported versions and dependencies are documented per product.
              Changes to third-party frameworks or platform APIs may require a
              resource update.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
