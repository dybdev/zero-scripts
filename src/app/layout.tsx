import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";

import { BasketDrawer } from "@/components/basket/basket-drawer";
import { AuthProvider } from "@/components/account/auth-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToastProvider } from "@/components/ui/toast-provider";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { env } from "@/lib/env";
import { readDiscordSession } from "@/lib/discord-auth";
import { getCatalogueAdapter } from "@/lib/tebex/client";
import type { BuyerIdentity } from "@/lib/tebex/types";
import { MotionProvider } from "@/providers/motion-provider";
import { QueryProvider } from "@/providers/query-provider";

import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/chivo-mono";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Zero Scripts - Premium FiveM Resources",
    template: "%s - Zero Scripts",
  },
  description:
    "Premium, performance-first FiveM scripts with secure validation, framework integrations, and maintained documentation.",
  applicationName: "Zero Scripts",
  openGraph: {
    type: "website",
    siteName: "Zero Scripts",
    title: "Zero Scripts - Premium FiveM Resources",
    description:
      "Performance-first FiveM resources built for production servers.",
    images: [
      {
        url: "/brand/zero-scripts-lockup.png",
        width: 1619,
        height: 498,
        alt: "Zero Scripts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zero Scripts - Premium FiveM Resources",
    description:
      "Performance-first FiveM resources built for production servers.",
    images: ["/brand/zero-scripts-lockup.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let buyer: BuyerIdentity | null = null;
  const cookieStore = await cookies();
  const discordVerified = Boolean(
    readDiscordSession(cookieStore.get("zero_discord_session")?.value),
  );
  if (env.TEBEX_DATA_SOURCE === "tebex") {
    const basketId = cookieStore.get("zero_tebex_basket")?.value;
    const hasCfxIdentity =
      cookieStore.get("zero_auth_provider")?.value === "cfx";
    if (basketId && hasCfxIdentity) {
      try {
        buyer = await getCatalogueAdapter().getBuyerIdentity(basketId, "cfx");
      } catch {
        buyer = null;
      }
    }
  }

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <MotionProvider>
            <AuthProvider
              authenticated={Boolean(buyer)}
              discordVerified={discordVerified}
            >
              <SmoothScroll />
              <SiteHeader buyer={buyer} />
              <main>{children}</main>
              <SiteFooter />
              <BasketDrawer />
              <ToastProvider />
            </AuthProvider>
          </MotionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
