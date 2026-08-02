import { randomBytes } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function GET(request: NextRequest) {
  if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
    return NextResponse.redirect(
      new URL("/?auth_error=discord_not_configured", request.url),
    );
  }

  const state = randomBytes(32).toString("base64url");
  const redirectUri = `${env.NEXT_PUBLIC_SITE_URL}/api/auth/discord/callback`;
  const authorizeUrl = new URL("https://discord.com/oauth2/authorize");
  authorizeUrl.searchParams.set("client_id", env.DISCORD_CLIENT_ID);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "identify");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("prompt", "consent");

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set("zero_discord_state", state, {
    ...cookieOptions,
    maxAge: 10 * 60,
  });
  return response;
}

export function POST() {
  if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
    return NextResponse.json(
      {
        message:
          "Discord login is not configured yet. Add the Discord OAuth credentials to the server.",
      },
      { status: 503 },
    );
  }

  const state = randomBytes(32).toString("base64url");
  const redirectUri = `${env.NEXT_PUBLIC_SITE_URL}/api/auth/discord/callback`;
  const authorizeUrl = new URL("https://discord.com/oauth2/authorize");
  authorizeUrl.searchParams.set("client_id", env.DISCORD_CLIENT_ID);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "identify");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("prompt", "consent");

  const response = NextResponse.json({ authUrl: authorizeUrl.toString() });
  response.cookies.set("zero_discord_state", state, {
    ...cookieOptions,
    maxAge: 10 * 60,
  });
  return response;
}

export function DELETE() {
  const response = NextResponse.json({ signedOut: true });
  for (const name of ["zero_discord_session", "zero_discord_state"]) {
    response.cookies.set(name, "", { ...cookieOptions, maxAge: 0 });
  }
  return response;
}
