import type { Metadata } from "next";

import { env } from "@/lib/env";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  const supportEmail = env.NEXT_PUBLIC_SUPPORT_EMAIL;
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
              We process the CFX display name and identifier returned through
              Tebex, the Discord user ID and profile name you authorize, basket
              contents, support communications, and technical request data such
              as IP address. Basket contents are also stored locally in your
              browser. We do not operate a customer password database.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Why we use this data
            </h2>
            <p className="mt-2">
              We use it to authenticate purchasers, prevent abuse, create and
              fulfill Tebex baskets, deliver Discord package actions, provide
              support, maintain security, and comply with financial and legal
              obligations. Depending on your location, these uses rely on
              contract performance, legitimate interests, consent, or legal
              obligations.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Checkout processing
            </h2>
            <p className="mt-2">
              Tebex processes checkout, payment, tax, fraud prevention, and
              purchase identity information under the notices shown during its
              hosted checkout flow. Discord processes the OAuth authorization
              used to verify your Discord identity. Vercel hosts this storefront
              and may process request logs and network metadata.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Cookies and local storage
            </h2>
            <p className="mt-2">
              Strictly necessary cookies preserve the Tebex basket, CFX
              provider, Discord OAuth state, and signed Discord session. Local
              storage preserves basket items. These technologies are required
              for login, security, and checkout rather than advertising.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Retention and international processing
            </h2>
            <p className="mt-2">
              Authentication cookies expire automatically, and local basket data
              remains until you clear it or your browser storage. Support and
              transaction records are retained only as needed for service,
              security, accounting, disputes, and legal requirements. Tebex,
              Discord, and Vercel may process data in countries outside yours
              under their published safeguards.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">
              Your choices and rights
            </h2>
            <p className="mt-2">
              You can sign out to remove storefront authentication cookies,
              clear local browser storage, revoke the Discord application from
              Discord settings, and contact us to request access, correction, or
              deletion where applicable. Payment records controlled by Tebex
              must be requested from Tebex and may be retained where legally
              required.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">Support requests</h2>
            <p className="mt-2">
              Only include information needed to diagnose the issue. Never share
              API keys, license secrets, or unrelated player data.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white">Contact</h2>
            <p className="mt-2">
              Privacy questions can be sent through the support page
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
