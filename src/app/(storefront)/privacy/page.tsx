import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <article className="content-shell px-4 pt-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-bold tracking-[0.16em] text-[var(--brand-red-light)] uppercase">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-white">
          Privacy
        </h1>
        <div className="mt-8 space-y-8 text-sm leading-7 text-[var(--neutral-400)]">
          <section>
            <h2 className="text-lg font-bold text-white">Storefront data</h2>
            <p className="mt-2">
              This initial storefront stores basket contents locally in your
              browser. It does not include local account registration or a
              customer password database.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Checkout processing
            </h2>
            <p className="mt-2">
              Tebex processes checkout, payment, tax, and purchase identity
              information under the notices shown during its hosted checkout
              flow.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">Support requests</h2>
            <p className="mt-2">
              Only include information needed to diagnose the issue. Never share
              API keys, license secrets, or unrelated player data.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
