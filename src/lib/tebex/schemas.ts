import { z } from "zod";

export const basketRequestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create"),
    items: z
      .array(
        z.object({
          packageId: z.string().min(1),
          quantity: z.number().int().min(1).max(20),
        }),
      )
      .min(1),
    code: z.string().trim().min(2).max(64).optional(),
    codeType: z.enum(["coupon", "creator-code"]).optional(),
  }),
  z.object({
    action: z.literal("add"),
    basketId: z.string().min(1),
    packageId: z.string().min(1),
    quantity: z.number().int().min(1).max(20).default(1),
  }),
  z.object({
    action: z.literal("remove"),
    basketId: z.string().min(1),
    packageId: z.string().min(1),
    quantity: z.number().int().min(1).max(20).default(1),
  }),
  z.object({
    action: z.literal("coupon"),
    basketId: z.string().min(1),
    code: z.string().trim().min(2).max(64),
  }),
  z.object({
    action: z.literal("creator-code"),
    basketId: z.string().min(1),
    code: z.string().trim().min(2).max(64),
  }),
  z.object({
    action: z.literal("checkout"),
    basketId: z.string().min(1),
  }),
]);

export const tebexEnvelopeSchema = z.object({
  data: z.unknown(),
});

export const tebexBasketSchema = z.object({
  ident: z.string(),
  currency: z.string().default("USD"),
  total_price: z.coerce.number().default(0),
  packages: z
    .array(
      z.object({
        id: z.coerce.string().optional(),
        package_id: z.coerce.string().optional(),
        name: z.string().default("Package"),
        quantity: z.coerce.number().int().optional(),
        qty: z.coerce.number().int().optional(),
        price: z.coerce.number().optional(),
        base_price: z.coerce.number().optional(),
      }),
    )
    .default([]),
  links: z.preprocess(
    (value) => (Array.isArray(value) ? undefined : value),
    z
      .object({
        checkout: z.string().nullish(),
      })
      .optional(),
  ),
});
