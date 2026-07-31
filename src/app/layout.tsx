import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Poppins } from "next/font/google";

import { BasketDrawer } from "@/components/basket/basket-drawer";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ToastProvider } from "@/components/ui/toast-provider";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { env } from "@/lib/env";
import { getCatalogueAdapter } from "@/lib/tebex/client";
import type { BuyerIdentity } from "@/lib/tebex/types";
import { QueryProvider } from "@/providers/query-provider";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Zero Scripts — Premium FiveM Resources",
    template: "%s — Zero Scripts",
  },
  description:
    "Premium, performance-first FiveM scripts with secure validation, framework integrations, and maintained documentation.",
  applicationName: "Zero Scripts",
  openGraph: {
    type: "website",
    siteName: "Zero Scripts",
    title: "Zero Scripts — Premium FiveM Resources",
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
    title: "Zero Scripts — Premium FiveM Resources",
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
  if (env.TEBEX_DATA_SOURCE === "tebex") {
    const cookieStore = await cookies();
    const basketId = cookieStore.get("zero_tebex_basket")?.value;
    const provider =
      cookieStore.get("zero_auth_provider")?.value === "discord"
        ? "discord"
        : "cfx";
    if (basketId) {
      try {
        buyer = await getCatalogueAdapter().getBuyerIdentity(
          basketId,
          provider,
        );
      } catch {
        buyer = null;
      }
    }
  }

  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <QueryProvider>
          <SmoothScroll />
          <SiteHeader buyer={buyer} />
          <main>{children}</main>
          <SiteFooter />
          <BasketDrawer />
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
