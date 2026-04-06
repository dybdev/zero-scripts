import { NextResponse } from 'next/server';

interface BasketRequestItem {
  id: string | number;
  quantity?: number;
}

interface BasketRequestBody {
  items?: BasketRequestItem[];
  returnUrl?: string;
  basketIdent?: string;
}

interface TebexCreateBasketResponse {
  data?: {
    ident?: string;
    links?: Array<{ rel?: string; href?: string }>; 
  };
}

interface TebexAuthMethod {
  name: string;
  url: string;
}

type TebexAuthMethodsResponse = TebexAuthMethod[] | { data?: TebexAuthMethod[] };

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

function normalizeItems(input: BasketRequestItem[] | undefined): Array<{ id: string | number; quantity: number }> {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => ({
      id: item.id,
      quantity: Number(item.quantity ?? 1),
    }))
    .filter((item) => item.id !== undefined && item.id !== null)
    .map((item) => ({
      ...item,
      quantity: Number.isFinite(item.quantity) && item.quantity > 0 ? Math.floor(item.quantity) : 1,
    }));
}

function extractCheckoutUrl(links: Array<{ rel?: string; href?: string }> | undefined): string | null {
  if (!Array.isArray(links)) return null;

  const checkoutLink = links.find((link) => link.rel === 'checkout' && typeof link.href === 'string');
  return checkoutLink?.href ?? null;
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

  if (!authRes.ok) return [];

  const authData = await safeJson<TebexAuthMethodsResponse>(authRes);
  if (Array.isArray(authData)) {
    return authData;
  }

  return Array.isArray(authData?.data) ? authData.data : [];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BasketRequestBody;
    const items = normalizeItems(body.items);
    const returnUrl = typeof body.returnUrl === 'string' ? body.returnUrl : '';
    const existingBasketIdent = typeof body.basketIdent === 'string' ? body.basketIdent.trim() : '';

    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const publicToken = process.env.TEBEX_PUBLIC_TOKEN;

    if (!publicToken) {
      // Mock checkout URL
      return NextResponse.json({ 
        url: `https://checkout.tebex.io/mock-checkout?returnUrl=${encodeURIComponent(returnUrl || '')}` 
      });
    }

    let basketIdent = existingBasketIdent;
    let checkoutUrl: string | null = null;

    if (!basketIdent) {
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

      const basketData = await safeJson<TebexCreateBasketResponse>(basketRes);
      basketIdent = basketData?.data?.ident ?? '';
      checkoutUrl = extractCheckoutUrl(basketData?.data?.links);

      if (!basketRes.ok || !basketIdent) {
        const message = `Failed to create basket (status ${basketRes.status})`;
        console.error(message, basketData);
        return NextResponse.json({ error: message }, { status: 502 });
      }
    }

    // Add all cart items to the basket.
    for (const item of items) {
      const addPackageRes = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_id: item.id,
          quantity: item.quantity,
        }),
        cache: 'no-store',
      });

      if (!addPackageRes.ok) {
        const addPackageError = await safeJson<TebexErrorResponse>(addPackageRes);
        const detail = addPackageError?.detail || addPackageError?.title || 'Failed to add package to basket';
        const requiresAuth = addPackageRes.status === 422 && /login/i.test(detail);

        if (requiresAuth) {
          const authMethods = await fetchAuthMethods(publicToken, basketIdent, returnUrl);
          return NextResponse.json(
            {
              error: detail,
              requiresAuth: true,
              basketIdent,
              authMethods,
              url: authMethods[0]?.url ?? null,
            },
            { status: 401 }
          );
        }

        return NextResponse.json({ error: detail, basketIdent }, { status: addPackageRes.status });
      }
    }

    // Client can launch Tebex checkout using this ident.
    return NextResponse.json({
      ident: basketIdent,
      basketIdent,
      url: checkoutUrl,
    });
  } catch (error) {
    console.error('Error creating Tebex basket:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
