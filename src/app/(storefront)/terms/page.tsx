import type { Metadata } from "next";

import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  const supportEmail = env.NEXT_PUBLIC_SUPPORT_EMAIL;
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
          <section>
            <h2 className="text-lg font-bold text-white">
              Accounts and eligibility
            </h2>
            <p className="mt-2">
              You must provide accurate CFX and Discord accounts that you are
              authorized to use. You are responsible for keeping those accounts
              secure. We may reject or cancel attempts involving fraud,
              sanctions, abuse, or unauthorized payment methods.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Pricing and payment
            </h2>
            <p className="mt-2">
              Displayed prices may exclude taxes. The final currency, taxes,
              discounts, and total are shown by Tebex before payment. Tebex is
              the merchant of record and processes the transaction under its
              checkout terms.
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
          <section>
            <h2 className="text-lg font-bold text-white">Acceptable use</h2>
            <p className="mt-2">
              You may not resell, redistribute, leak, reverse engineer where
              prohibited, bypass license controls, or use a resource unlawfully.
              Access may be suspended for material violations of these terms.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Updates and compatibility
            </h2>
            <p className="mt-2">
              We may improve, replace, or discontinue features. Compatibility
              depends on the versions and dependencies stated on each product
              page; third-party platform changes are outside our control.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Liability and governing terms
            </h2>
            <p className="mt-2">
              Resources are provided to the extent permitted by applicable law
              without guarantees beyond those expressly stated. Nothing here
              limits mandatory consumer rights. Tebex checkout terms also apply
              to payment, tax, disputes, and refunds.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">Contact</h2>
            <p className="mt-2">
              Questions about these terms can be sent through the support page
              {supportEmail ? (
                <>
                  {" "}
                  or to{" "}
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-white underline underline-offset-4"
                  >
                    {supportEmail}
                  </a>
                </>
              ) : null}
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
