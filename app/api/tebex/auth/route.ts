import { NextResponse } from 'next/server';

interface AuthRequestBody {
  returnUrl?: string;
  basketIdent?: string;
}

interface TebexAuthMethod {
  name: string;
  url: string;
}

type TebexAuthMethodsResponse = TebexAuthMethod[] | { data?: TebexAuthMethod[] };

interface TebexCreateBasketResponse {
  data?: {
    ident?: string;
  };
}

interface TebexErrorResponse {
  detail?: string;
  title?: string;
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function normalizeAuthMethods(payload: TebexAuthMethodsResponse | null): TebexAuthMethod[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload.data) ? payload.data : [];
}

async function createBasket(publicToken: string, returnUrl: string): Promise<string | null> {
  const createBasketBody: Record<string, string> = {};

  if (returnUrl) {
    createBasketBody.return_url = returnUrl;
    createBasketBody.complete_url = returnUrl;
  }

  const basketRes = await fetch(`https://headless.tebex.io/api/accounts/${publicToken}/baskets`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createBasketBody),
    cache: 'no-store',
  });

  if (!basketRes.ok) {
    const errorBody = await safeJson<TebexErrorResponse>(basketRes);
    const message = errorBody?.detail || errorBody?.title || `Failed to create auth basket (status ${basketRes.status})`;
    throw new Error(message);
  }

  const basketData = await safeJson<TebexCreateBasketResponse>(basketRes);
  return basketData?.data?.ident ?? null;
}

async function fetchAuthMethods(publicToken: string, basketIdent: string, returnUrl: string): Promise<TebexAuthMethod[]> {
  const query = new URLSearchParams();
  if (returnUrl) {
    query.set('returnUrl', returnUrl);
  }

  const authUrl = `https://headless.tebex.io/api/accounts/${publicToken}/baskets/${basketIdent}/auth${query.toString() ? `?${query.toString()}` : ''}`;
  const authRes = await fetch(authUrl, {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!authRes.ok) {
    const errorBody = await safeJson<TebexErrorResponse>(authRes);
    const message = errorBody?.detail || errorBody?.title || `Failed to fetch auth methods (status ${authRes.status})`;
    throw new Error(message);
  }

  const authData = await safeJson<TebexAuthMethodsResponse>(authRes);
  return normalizeAuthMethods(authData);
}

export async function POST(request: Request) {
  try {
    const publicToken = process.env.TEBEX_PUBLIC_TOKEN;

    if (!publicToken) {
      return NextResponse.json({ error: 'TEBEX_PUBLIC_TOKEN is not configured' }, { status: 500 });
    }

    const body = (await request.json().catch(() => ({}))) as AuthRequestBody;
    const returnUrl = typeof body.returnUrl === 'string' ? body.returnUrl : '';

    const requestedBasketIdent = typeof body.basketIdent === 'string' ? body.basketIdent.trim() : '';
    let basketIdent = requestedBasketIdent;
    if (!basketIdent) {
      basketIdent = (await createBasket(publicToken, returnUrl)) ?? '';
    }

    if (!basketIdent) {
      return NextResponse.json({ error: 'Failed to initialize Tebex basket for auth' }, { status: 502 });
    }

    let authMethods: TebexAuthMethod[] = [];

    try {
      authMethods = await fetchAuthMethods(publicToken, basketIdent, returnUrl);
    } catch (error) {
      // Recover from stale client-side basket IDs by creating a new basket and retrying once.
      if (!requestedBasketIdent) {
        throw error;
      }

      basketIdent = (await createBasket(publicToken, returnUrl)) ?? '';
      if (!basketIdent) {
        throw error;
      }

      authMethods = await fetchAuthMethods(publicToken, basketIdent, returnUrl);
    }

    if (authMethods.length === 0) {
      return NextResponse.json(
        {
          error: 'No Tebex auth methods are available for this basket',
          basketIdent,
          authMethods: [],
          url: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      basketIdent,
      authMethods,
      url: authMethods[0]?.url ?? null,
    });
  } catch (error) {
    console.error('Error starting Tebex auth:', error);
    return NextResponse.json({ error: 'Failed to initialize Tebex auth' }, { status: 500 });
  }
}
