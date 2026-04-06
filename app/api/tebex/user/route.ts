import { NextResponse } from 'next/server';

interface TebexBasketResponse {
  data?: {
    username?: string | null;
    username_id?: string | null;
  };
}

export async function GET(request: Request) {
  try {
    const publicToken = process.env.TEBEX_PUBLIC_TOKEN;

    if (!publicToken) {
      return NextResponse.json({ user: null });
    }

    const url = new URL(request.url);
    const basketIdent = url.searchParams.get('basketIdent')?.trim();

    if (!basketIdent) {
      return NextResponse.json({ user: null });
    }

    const basketRes = await fetch(`https://headless.tebex.io/api/accounts/${publicToken}/baskets/${basketIdent}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (basketRes.status === 404) {
      return NextResponse.json({ user: null });
    }

    if (!basketRes.ok) {
      const message = `Failed to fetch basket user (status ${basketRes.status})`;
      console.error(message);
      return NextResponse.json({ error: message, user: null }, { status: 502 });
    }

    const basketData = (await basketRes.json()) as TebexBasketResponse;
    const username = basketData.data?.username;
    const usernameId = basketData.data?.username_id;

    if (!username || !usernameId) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: usernameId,
        username,
        basketIdent,
      },
    });
  } catch (error) {
    console.error('Error fetching Tebex user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
