'use client';

import { Button } from '@/components/ui/button';
import SmoothDrawer from '@/components/kokonutui/smooth-drawer';
import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TEBEX_BASKET_STORAGE_KEY = 'tebex-basket-ident';

interface TebexAuthMethod {
  name: string;
  url: string;
}

interface TebexAuthResponse {
  basketIdent?: string;
  authMethods?: TebexAuthMethod[];
  url?: string | null;
  error?: string;
}

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [authMethods, setAuthMethods] = useState<TebexAuthMethod[]>([]);
  const [basketIdent, setBasketIdent] = useState<string | null>(null);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [isRedirectingProvider, setIsRedirectingProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const providers = useMemo(() => {
    return authMethods
      .map((method) => {
      const providerName = method.name.trim();
      const lowerName = providerName.toLowerCase();

      if (lowerName.includes('discord')) {
        return {
          ...method,
          label: 'Continue with Discord',
          className: 'w-full bg-primary text-white hover:bg-[#ff3d3d]',
        };
      }

      if (lowerName.includes('fivem') || lowerName.includes('cfx')) {
        return {
          ...method,
          label: 'Continue with FiveM (CFX)',
          className: 'w-full bg-primary text-white hover:bg-[#ff3d3d]',
        };
      }

      return {
        ...method,
        label: `Continue with ${providerName}`,
        className: 'w-full bg-primary text-white hover:bg-[#ff3d3d]',
      };
      })
      .sort((a, b) => {
        const aDiscord = a.name.toLowerCase().includes('discord');
        const bDiscord = b.name.toLowerCase().includes('discord');
        if (aDiscord === bDiscord) return 0;
        return aDiscord ? -1 : 1;
      });
  }, [authMethods]);

  useEffect(() => {
    document.body.setAttribute('data-auth-open', open ? 'true' : 'false');

    return () => {
      document.body.removeAttribute('data-auth-open');
    };
  }, [open]);

  const loadAuthMethods = async () => {
    setErrorMessage(null);
    setIsLoadingMethods(true);

    try {
      const existingBasketIdent = window.localStorage.getItem(TEBEX_BASKET_STORAGE_KEY);

      const res = await fetch('/api/tebex/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnUrl: window.location.origin,
          basketIdent: existingBasketIdent || undefined,
        }),
      });

      const data = (await res.json()) as TebexAuthResponse;

      if (data.basketIdent) {
        window.localStorage.setItem(TEBEX_BASKET_STORAGE_KEY, data.basketIdent);
        setBasketIdent(data.basketIdent);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize Tebex login');
      }

      const methods = Array.isArray(data.authMethods) ? data.authMethods : [];
      setAuthMethods(methods);

      if (methods.length === 0) {
        setErrorMessage('No login methods are available right now.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initialize Tebex login';
      setErrorMessage(message);
      setAuthMethods([]);
    } finally {
      setIsLoadingMethods(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setIsRedirectingProvider(null);
      return;
    }

    loadAuthMethods();
  }, [open]);

  const showRedirectNotice = (providerName: string) => {
    toast.custom(
      () => (
        <div className="relative w-[340px] overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0c0f08]/95 p-4 text-zinc-100 shadow-[0_0_30px_-18px_rgba(255,180,0,0.85)] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/35 bg-amber-500/15">
              <Loader2 className="h-5 w-5 animate-spin text-amber-300" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold leading-tight">
                Redirecting to {providerName} for login...
              </p>
              <p className="mt-1 text-sm text-zinc-400">Please Wait...</p>
            </div>
          </div>
          <div className="mt-3 h-1 w-full rounded-full bg-amber-500/20">
            <div className="h-full w-3/5 rounded-full bg-amber-400" />
          </div>
        </div>
      ),
      { duration: 1800 }
    );
  };

  const handleProviderRedirect = (method: TebexAuthMethod) => {
    if (basketIdent) {
      window.localStorage.setItem(TEBEX_BASKET_STORAGE_KEY, basketIdent);
    }

    setIsRedirectingProvider(method.name);
    const lowerName = method.name.toLowerCase();
    const providerName = lowerName.includes('fivem') || lowerName.includes('cfx') ? 'FiveM' : method.name;

    showRedirectNotice(providerName);
    window.setTimeout(() => {
      window.location.href = method.url;
    }, 280);
  };

  return (
    <SmoothDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Welcome Back"
      description="Sign in with your Tebex provider."
      className="sm:max-w-md"
    >
      <div className="flex flex-col space-y-3">
        {isLoadingMethods ? (
          <Button className="w-full" size="lg" disabled>
            Loading providers...
          </Button>
        ) : null}

        {!isLoadingMethods && providers.length > 0
          ? providers.map((provider) => (
              <Button
                key={provider.name}
                className={provider.className}
                size="lg"
                onClick={() => handleProviderRedirect(provider)}
                disabled={!!isRedirectingProvider}
              >
                {isRedirectingProvider === provider.name ? 'Redirecting...' : provider.label}
              </Button>
            ))
          : null}

        {!isLoadingMethods && providers.length === 0 ? (
          <Button className="w-full" size="lg" onClick={loadAuthMethods}>
            Retry Tebex Login
          </Button>
        ) : null}

        {errorMessage ? (
          <p className="text-center text-sm text-red-400">{errorMessage}</p>
        ) : null}
      </div>
    </SmoothDrawer>
  );
}
