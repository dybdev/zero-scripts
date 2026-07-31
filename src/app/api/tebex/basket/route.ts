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

  let stage = "creating the basket";

  try {
    const adapter = getCatalogueAdapter();
    const input = parsed.data;
    let basket;

    if (input.action === "create") {
      stage = "creating the Tebex basket";
      basket = await adapter.createBasket({
        completeUrl: `${env.NEXT_PUBLIC_SITE_URL}/?checkout=complete`,
        cancelUrl: `${env.NEXT_PUBLIC_SITE_URL}/store?checkout=cancelled`,
        ipAddress: getRequestIpv4(request),
      });
      for (const item of input.items) {
        stage = `adding package ${item.packageId}`;
        basket = await adapter.addPackage(
          basket.ident,
          item.packageId,
          item.quantity,
        );
      }
      stage = "retrieving the checkout link";
      basket = await adapter.getCheckout(basket.ident);
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
    return NextResponse.json(
      {
        message: `Checkout failed while ${stage}. ${reason}`,
        stage,
        upstreamStatus: status ? Number(status) : undefined,
      },
      { status: 502 },
    );
  }
}
