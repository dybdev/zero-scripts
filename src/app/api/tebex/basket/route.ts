import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getRequestIpv4 } from "@/lib/request-ip";
import { getCatalogueAdapter } from "@/lib/tebex/client";
import { basketRequestSchema } from "@/lib/tebex/schemas";

function getSafeUpstreamDetail(error: unknown) {
  if (!(error instanceof Error)) return undefined;
  const jsonStart = error.message.indexOf("{");
  if (jsonStart === -1) return undefined;

  try {
    const body = JSON.parse(error.message.slice(jsonStart)) as Record<
      string,
      unknown
    >;
    const detail = [body.detail, body.message, body.title, body.error].find(
      (value) => typeof value === "string" && value.trim(),
    );
    return typeof detail === "string" ? detail.slice(0, 240) : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  const parsed = basketRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: "The basket request is invalid." },
      { status: 400 },
    );
  }

  if (env.TEBEX_DATA_SOURCE === "mock") {
    return NextResponse.json({
      message:
        "Mock catalogue mode is active. Add Tebex credentials to create a real hosted checkout.",
    });
  }

  let stage = "creating the basket";

  try {
    const adapter = getCatalogueAdapter();
    const input = parsed.data;
    let basket;

    if (input.action === "create") {
      let basketId = request.cookies.get("zero_tebex_basket")?.value;
      const provider =
        request.cookies.get("zero_auth_provider")?.value === "discord"
          ? "discord"
          : "cfx";

      if (!basketId) {
        stage = "creating the Tebex basket";
        basket = await adapter.createBasket({
          completeUrl: `${env.NEXT_PUBLIC_SITE_URL}/?checkout=complete`,
          cancelUrl: `${env.NEXT_PUBLIC_SITE_URL}/store?checkout=cancelled`,
          ipAddress: getRequestIpv4(request),
        });
        basketId = basket.ident;
      }

      stage = "checking buyer authentication";
      const buyer = await adapter.getBuyerIdentity(basketId, provider);
      if (!buyer) {
        stage = "preparing buyer authentication";
        const returnUrl = `${env.NEXT_PUBLIC_SITE_URL}/store?authenticated=true&checkout=resume`;
        const links = await adapter.getAuthenticationLinks(
          basketId,
          returnUrl,
        );
        const preferred =
          links.find((link) => /fivem|cfx/i.test(link.name)) ??
          links.find((link) => /discord/i.test(link.name)) ??
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
          requiresAuthentication: true,
          provider: preferred.name,
          authUrl: preferred.url,
          message: `Continue with ${preferred.name} before checkout.`,
        });
        response.cookies.set("zero_tebex_basket", basketId, {
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
      }

      for (const item of input.items) {
        stage = `adding package ${item.packageId}`;
        basket = await adapter.addPackage(
          basketId,
          item.packageId,
          item.quantity,
        );
      }
      stage = "retrieving the checkout link";
      basket = await adapter.getCheckout(basketId);
    } else if (input.action === "add") {
      stage = `adding package ${input.packageId}`;
      basket = await adapter.addPackage(
        input.basketId,
        input.packageId,
        input.quantity,
      );
    } else if (input.action === "remove") {
      stage = `removing package ${input.packageId}`;
      basket = await adapter.removePackage(
        input.basketId,
        input.packageId,
        input.quantity,
      );
    } else if (input.action === "coupon") {
      stage = "applying the coupon";
      basket = await adapter.applyCoupon(input.basketId, input.code);
    } else if (input.action === "creator-code") {
      stage = "applying the creator code";
      basket = await adapter.applyCreatorCode(input.basketId, input.code);
    } else {
      stage = "retrieving the checkout link";
      basket = await adapter.getCheckout(input.basketId);
    }

    return NextResponse.json({
      basket,
      checkoutUrl: basket.checkoutUrl,
    });
  } catch (error) {
    console.error("Tebex basket request failed", error);
    const status =
      error instanceof Error
        ? error.message.match(/status\s+(\d{3})/i)?.[1]
        : undefined;
    const reason =
      error instanceof Error && error.name === "ZodError"
        ? "Tebex returned an unexpected basket response."
        : status
          ? `Tebex responded with HTTP ${status}.`
          : "The server could not process Tebex's response.";
    const upstreamDetail = getSafeUpstreamDetail(error);
    return NextResponse.json(
      {
        message: `Checkout failed while ${stage}. ${reason}${
          upstreamDetail ? ` ${upstreamDetail}` : ""
        }`,
        stage,
        upstreamStatus: status ? Number(status) : undefined,
        upstreamDetail,
      },
      { status: 502 },
    );
  }
}
