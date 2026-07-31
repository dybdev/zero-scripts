import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getRequestIpv4 } from "@/lib/request-ip";
import { getCatalogueAdapter } from "@/lib/tebex/client";
import { basketRequestSchema } from "@/lib/tebex/schemas";

export async function POST(request: Request) {
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

  try {
    const adapter = getCatalogueAdapter();
    const input = parsed.data;
    let basket;

    if (input.action === "create") {
      basket = await adapter.createBasket({
        completeUrl: `${env.NEXT_PUBLIC_SITE_URL}/?checkout=complete`,
        cancelUrl: `${env.NEXT_PUBLIC_SITE_URL}/store?checkout=cancelled`,
        ipAddress: getRequestIpv4(request),
      });
      for (const item of input.items) {
        basket = await adapter.addPackage(
          basket.ident,
          item.packageId,
          item.quantity,
        );
      }
      basket = await adapter.getCheckout(basket.ident);
    } else if (input.action === "add") {
      basket = await adapter.addPackage(
        input.basketId,
        input.packageId,
        input.quantity,
      );
    } else if (input.action === "remove") {
      basket = await adapter.removePackage(
        input.basketId,
        input.packageId,
        input.quantity,
      );
    } else if (input.action === "coupon") {
      basket = await adapter.applyCoupon(input.basketId, input.code);
    } else if (input.action === "creator-code") {
      basket = await adapter.applyCreatorCode(input.basketId, input.code);
    } else {
      basket = await adapter.getCheckout(input.basketId);
    }

    return NextResponse.json({
      basket,
      checkoutUrl: basket.checkoutUrl,
    });
  } catch (error) {
    console.error("Tebex basket request failed", error);
    return NextResponse.json(
      {
        message:
          "Tebex could not prepare checkout. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}
