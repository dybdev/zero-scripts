import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getRequestIpv4 } from "@/lib/request-ip";
import { getCatalogueAdapter } from "@/lib/tebex/client";

export async function POST(request: Request) {
  if (env.TEBEX_DATA_SOURCE === "mock") {
    return NextResponse.json(
      {
        message:
          "Sign in requires a configured Tebex store. Mock catalogue mode is currently active.",
      },
      { status: 409 },
    );
  }

  try {
    const adapter = getCatalogueAdapter();
    const returnUrl = `${env.NEXT_PUBLIC_SITE_URL}/?authenticated=true`;
    const basket = await adapter.createBasket({
      completeUrl: `${env.NEXT_PUBLIC_SITE_URL}/?checkout=complete`,
      cancelUrl: `${env.NEXT_PUBLIC_SITE_URL}/`,
      ipAddress: getRequestIpv4(request),
    });
    const links = await adapter.getAuthenticationLinks(basket.ident, returnUrl);
    const preferred =
      links.find((link) => /discord/i.test(link.name)) ??
      links.find((link) => /fivem|cfx/i.test(link.name)) ??
      links[0];

    if (!preferred) {
      return NextResponse.json(
        {
          message:
            "No Cfx or Discord authentication provider is enabled for this Tebex store.",
        },
        { status: 422 },
      );
    }

    const response = NextResponse.json({
      provider: preferred.name,
      authUrl: preferred.url,
    });
    response.cookies.set("zero_tebex_basket", basket.ident, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });
    response.cookies.set(
      "zero_auth_provider",
      /discord/i.test(preferred.name) ? "discord" : "cfx",
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60,
      },
    );
    return response;
  } catch (error) {
    console.error("Tebex authentication request failed", error);
    return NextResponse.json(
      {
        message: "Tebex could not start sign in. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ signedOut: true });
  for (const name of ["zero_tebex_basket", "zero_auth_provider"]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  }
  return response;
}
