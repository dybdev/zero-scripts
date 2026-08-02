import { z } from "zod";

const envSchema = z.object({
  TEBEX_DATA_SOURCE: z.enum(["mock", "tebex"]).default("mock"),
  TEBEX_WEBSTORE_TOKEN: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1).optional(),
  ),
  TEBEX_PRIVATE_KEY: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1).optional(),
  ),
  TEBEX_API_BASE_URL: z.url().default("https://headless.tebex.io/api"),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  DISCORD_CLIENT_ID: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1).optional(),
  ),
  DISCORD_CLIENT_SECRET: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().min(1).optional(),
  ),
});

export const env = envSchema.parse({
  TEBEX_DATA_SOURCE: process.env.TEBEX_DATA_SOURCE,
  TEBEX_WEBSTORE_TOKEN: process.env.TEBEX_WEBSTORE_TOKEN,
  TEBEX_PRIVATE_KEY: process.env.TEBEX_PRIVATE_KEY,
  TEBEX_API_BASE_URL: process.env.TEBEX_API_BASE_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
});
