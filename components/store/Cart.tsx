'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { useCurrencyStore, CURRENCIES } from '@/store/useCurrencyStore';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, ShoppingCart, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LoginModal } from '@/components/auth/LoginModal';
import { toast } from 'sonner';
import Image from 'next/image';

const TEBEX_BASKET_STORAGE_KEY = 'tebex-basket-ident';

interface CheckoutResponse {
  ident?: string;
  basketIdent?: string;
  url?: string | null;
  requiresAuth?: boolean;
  error?: string;
}

interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Cart({ open, onOpenChange }: CartProps) {
  const { items, removeItem, totalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();
  const { currency } = useCurrencyStore();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-cart-open', open ? 'true' : 'false');

    return () => {
      document.body.removeAttribute('data-cart-open');
    };
  }, [open]);

  const currencyData = CURRENCIES[currency] || CURRENCIES.USD;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    if (items.length === 0) return;

    setIsCheckoutLoading(true);
    try {
      const existingBasketIdent = window.localStorage.getItem(TEBEX_BASKET_STORAGE_KEY);
      const res = await fetch('/api/tebex/basket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          returnUrl: window.location.origin,
          basketIdent: existingBasketIdent || undefined,
        }),
      });

      const data = (await res.json()) as CheckoutResponse;

      if (data.requiresAuth) {
        if (data.basketIdent) {
          window.localStorage.setItem(TEBEX_BASKET_STORAGE_KEY, data.basketIdent);
        }

        if (data.url) {
          toast.info('Redirecting to Tebex login...');
          window.location.href = data.url;
          return;
        }

        throw new Error(data.error || 'Checkout requires Tebex authentication');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.ident) {
        window.localStorage.removeItem(TEBEX_BASKET_STORAGE_KEY);
        clearCart();

        const tebexModule = await import('@tebexio/tebex.js');
        const Tebex = (tebexModule.default ?? tebexModule) as any;

        if (Tebex?.checkout?.init && Tebex?.checkout?.launch) {
          Tebex.checkout.init({ ident: data.ident });
          Tebex.checkout.launch();
          return;
        }

        if (data.url) {
          window.location.href = data.url;
          return;
        }

        throw new Error('Unable to launch Tebex checkout');
      }

      if (data.url) {
        window.localStorage.removeItem(TEBEX_BASKET_STORAGE_KEY);
        clearCart();
        window.location.href = data.url;
        return;
      }

      throw new Error('No checkout session returned');
    } catch (error) {
      console.error(error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex w-full flex-col border-white/10 bg-[#080808]/95 text-white backdrop-blur-sm sm:max-w-lg">
          <SheetHeader className="border-b border-white/10 pb-4">
            <SheetTitle className="text-white">Your Cart</SheetTitle>
            <p className="text-xs text-zinc-500">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-1 py-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-3 text-center text-zinc-500">
                <div className="rounded-full border border-white/10 bg-white/[0.03] p-3">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <p className="text-sm">Your cart is empty</p>
                <p className="max-w-[220px] text-xs text-zinc-600">
                  Add products to continue to secure Tebex checkout.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pr-1">
                {items.map((item) => {
                  const itemPrice = ((item.price || 0) * currencyData.rate * item.quantity).toFixed(2);
                  return (
                    <div
                      key={item.id}
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-primary/35"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#111]">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-wider text-zinc-600">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="line-clamp-2 text-sm font-semibold leading-tight text-white">{item.name}</h4>
                        <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-base font-semibold text-white">
                          {mounted ? `${currencyData.symbol}${itemPrice}` : `$${((item.price || 0) * item.quantity).toFixed(2)}`}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 rounded-lg border border-white/15 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="space-y-3 border-t border-white/10 bg-[#080808]/95 px-1 pt-4 pb-1">
              <div className="flex items-center justify-between text-lg font-semibold text-white">
                <span>Total</span>
                <span>
                  {mounted ? `${currencyData.symbol}${(totalPrice() * currencyData.rate).toFixed(2)}` : `$${totalPrice().toFixed(2)}`}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Secure checkout powered by Tebex
              </div>

              <Button
                className="w-full h-12 text-base font-semibold"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? 'Processing...' : 'Checkout'}
                {!isCheckoutLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-zinc-400 hover:text-white"
                onClick={clearCart}
              >
                Clear cart
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}
