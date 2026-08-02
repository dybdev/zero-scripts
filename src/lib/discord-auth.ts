import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "@/lib/env";
import type { BuyerIdentity } from "@/lib/tebex/types";

interface DiscordSession {
  id: string;
  username: string;
  expiresAt: number;
}

function signature(value: string) {
  if (!env.DISCORD_CLIENT_SECRET) return "";
  return createHmac("sha256", env.DISCORD_CLIENT_SECRET)
    .update(value)
    .digest("base64url");
}

export function createDiscordSession(id: string, username: string) {
  const encoded = Buffer.from(
    JSON.stringify({
      id,
      username,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    } satisfies DiscordSession),
  ).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

export function readDiscordSession(value?: string): BuyerIdentity | null {
  if (!value || !env.DISCORD_CLIENT_SECRET) return null;
  const [encoded, suppliedSignature] = value.split(".");
  if (!encoded || !suppliedSignature) return null;
  const expectedSignature = signature(encoded);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as DiscordSession;
    if (!session.id || !session.username || session.expiresAt <= Date.now()) {
      return null;
    }
    return {
      displayName: session.username,
      provider: "discord",
      usernameId: session.id,
    };
  } catch {
    return null;
  }
}
