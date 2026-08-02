import { NextRequest, NextResponse } from "next/server";

import { createDiscordSession } from "@/lib/discord-auth";
import { env } from "@/lib/env";

interface DiscordTokenResponse {
  access_token?: string;
}

interface DiscordUser {
  id?: string;
  username?: string;
  global_name?: string | null;
}

function returnToSite(request: NextRequest, error?: string) {
  const storedReturnTo = request.cookies.get("zero_discord_return_to")?.value;
  const returnTo =
    storedReturnTo?.startsWith("/") && !storedReturnTo.startsWith("//")
      ? storedReturnTo
      : "/";
  const url = new URL(returnTo, env.NEXT_PUBLIC_SITE_URL);
  if (error) url.searchParams.set("auth_error", error);
  else url.searchParams.set("authenticated", "discord");
  return url;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("zero_discord_state")?.value;
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(
      returnToSite(request, "discord_state_invalid"),
    );
  }
  if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
    return NextResponse.redirect(
      returnToSite(request, "discord_not_configured"),
    );
  }

  try {
    const redirectUri = `${env.NEXT_PUBLIC_SITE_URL}/api/auth/discord/callback`;
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });
    const token = (await tokenResponse.json()) as DiscordTokenResponse;
    if (!tokenResponse.ok || !token.access_token)
      throw new Error("token exchange failed");

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
    });
    const user = (await userResponse.json()) as DiscordUser;
    if (!userResponse.ok || !user.id || !user.username)
      throw new Error("profile request failed");

    const response = NextResponse.redirect(returnToSite(request));
    response.cookies.set(
      "zero_discord_session",
      createDiscordSession(user.id, user.global_name?.trim() || user.username),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      },
    );
    response.cookies.set("zero_discord_state", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("zero_discord_return_to", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    console.error("Discord authentication failed", error);
    return NextResponse.redirect(returnToSite(request, "discord_failed"));
  }
}
