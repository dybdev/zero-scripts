"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { ProductArtwork } from "@/components/product/product-artwork";
import { useOverlay } from "@/hooks/use-overlay";
import { formatPrice } from "@/lib/utils";
import { useBasketStore } from "@/stores/basket-store";

import { QuantityControl } from "./quantity-control";

interface CheckoutResponse {
  checkoutUrl?: string;
  authUrl?: string;
  requiresAuthentication?: boolean;
  provider?: string;
  message?: string;
}

export function BasketDrawer() {
  const items = useBasketStore((state) => state.items);
  const isOpen = useBasketStore((state) => state.isOpen);
  const closeStore = useBasketStore((state) => state.close);
  const removeItem = useBasketStore((state) => state.removeItem);
  const setQuantity = useBasketStore((state) => state.setQuantity);
  const clear = useBasketStore((state) => state.clear);
  const [code, setCode] = useState("");
  const [codeType, setCodeType] = useState<"coupon" | "creator-code">("coupon");
  const [codeReady, setCodeReady] = useState(false);
  const [status, setStatus] = useState("");
  const [discordPrompt, setDiscordPrompt] = useState(false);
  const [discordPending, setDiscordPending] = useState(false);
  const close = useCallback(() => {
    closeStore();
    setStatus("");
    setDiscordPrompt(false);
  }, [closeStore]);
  const overlayRef = useOverlay(isOpen, close);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const checkout = useMutation({
    mutationFn: async (): Promise<CheckoutResponse> => {
      const response = await fetch("/api/tebex/basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          items: items.map((item) => ({
            packageId: item.product.id,
            quantity: item.quantity,
          })),
          ...(codeReady && code.trim() ? { code: code.trim(), codeType } : {}),
        }),
      });
      const body = (await response.json()) as CheckoutResponse;
      if (!response.ok) throw new Error(body.message ?? "Checkout failed.");
      return body;
    },
    onSuccess: (data) => {
      if (data.requiresAuthentication && data.provider === "discord") {
        setStatus("");
        setDiscordPrompt(true);
        return;
      }
      if (data.requiresAuthentication && data.authUrl) {
        toast.info(data.message ?? "Sign in is required before checkout.", {
          toastId: "checkout-auth",
        });
        window.location.assign(data.authUrl);
        return;
      }
      if (data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
      } else {
        const message =
          data.message ??
          "Checkout becomes available when Tebex credentials are configured.";
        setStatus(message);
        toast.info(message, { toastId: "checkout-mode" });
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Checkout could not be prepared.",
      );
    },
  });

  const continueWithDiscord = async () => {
    setDiscordPending(true);
    try {
      const response = await fetch("/api/auth/discord", { method: "POST" });
      const body = (await response.json()) as {
        authUrl?: string;
        message?: string;
      };
      if (!response.ok || !body.authUrl) {
        throw new Error(
          body.message ?? "Discord sign in could not be started.",
        );
      }
      window.location.assign(body.authUrl);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Discord sign in could not be started.",
      );
      setDiscordPending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close basket"
            className="fixed inset-0 z-60 cursor-default bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={close}
          />
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="basket-title"
            className="fixed top-0 right-0 z-70 flex h-dvh w-full flex-col border-l border-white/10 bg-[#111] shadow-[-30px_0_80px_rgba(0,0,0,.45)] sm:max-w-[480px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex min-h-20 shrink-0 items-center justify-between border-b border-white/8 px-5 sm:px-6">
              <div>
                <p id="basket-title" className="text-xl font-bold text-white">
                  Your basket
                </p>
                <p className="mt-0.5 text-sm text-[var(--neutral-400)]">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="icon-button"
                aria-label="Close basket"
              >
                <X size={19} strokeWidth={2.2} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="grid size-16 place-items-center rounded-2xl border border-white/8 bg-[#171717]">
                  <ShoppingBag
                    size={30}
                    strokeWidth={1.8}
                    className="text-[var(--brand-red-light)]"
                  />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">
                  Your basket is empty
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--neutral-400)]">
                  Add a resource and it will stay here while you continue
                  browsing.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="button-secondary mt-6"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between pb-1">
                    <p className="text-sm font-semibold text-[#aaa]">
                      Selected resources
                    </p>
                    <button
                      type="button"
                      onClick={clear}
                      className="text-xs font-semibold text-[#888] transition-colors hover:text-[var(--brand-red-light)]"
                    >
                      Clear basket
                    </button>
                  </div>
                  {items.map(({ product, quantity }) => (
                    <article
                      key={product.id}
                      className="flex gap-4 rounded-[12px] border border-white/8 bg-[#161616] p-3.5"
                    >
                      <Link
                        href={`/store/package/${product.slug}`}
                        onClick={close}
                        className="shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:outline-none"
                      >
                        <ProductArtwork
                          product={product}
                          className="h-24 w-28 rounded-lg"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/store/package/${product.slug}`}
                              onClick={close}
                              className="line-clamp-2 text-sm leading-5 font-bold text-white hover:text-[var(--brand-red-light)]"
                            >
                              {product.name}
                            </Link>
                            <p className="mt-1 text-xs text-[#888]">
                              {product.category}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="icon-button h-11! w-11! shrink-0 border-0! bg-transparent!"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 size={15} strokeWidth={2} />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          {product.quantitySupported ? (
                            <QuantityControl
                              quantity={quantity}
                              onChange={(next) => setQuantity(product.id, next)}
                            />
                          ) : (
                            <span className="text-[10px] font-semibold text-[#777] uppercase">
                              Single license
                            </span>
                          )}
                          <span className="text-sm font-bold text-white tabular-nums">
                            {formatPrice(product.price * quantity)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="shrink-0 border-t border-white/8 bg-[#151515] p-5 sm:p-6">
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      const hasCode = code.trim().length >= 2;
                      setCodeReady(hasCode);
                      const message = hasCode
                        ? `${codeType === "coupon" ? "Coupon" : "Creator code"} ${code.trim()} will be applied to the Tebex basket at checkout.`
                        : "Enter a valid code first.";
                      setStatus(message);
                      toast.info(message, { toastId: "basket-code" });
                    }}
                    className="grid grid-cols-[auto_1fr_auto] gap-2"
                  >
                    <label htmlFor="basket-code-type" className="sr-only">
                      Code type
                    </label>
                    <select
                      id="basket-code-type"
                      value={codeType}
                      onChange={(event) => {
                        setCodeType(
                          event.target.value as "coupon" | "creator-code",
                        );
                        setCodeReady(false);
                      }}
                      className="field w-28 px-2 text-xs"
                    >
                      <option value="coupon">Coupon</option>
                      <option value="creator-code">Creator</option>
                    </select>
                    <label htmlFor="basket-code" className="sr-only">
                      Coupon or creator code
                    </label>
                    <input
                      id="basket-code"
                      value={code}
                      onChange={(event) => {
                        setCode(event.target.value);
                        setCodeReady(false);
                      }}
                      placeholder="Enter code"
                      className="field min-w-0 flex-1"
                    />
                    <button type="submit" className="button-secondary px-4">
                      Apply
                    </button>
                  </form>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-[var(--neutral-400)]">
                      Subtotal
                    </span>
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#777]">
                    Taxes and applicable discounts are calculated by Tebex.
                  </p>
                  {status || checkout.error ? (
                    <p
                      role="status"
                      className="mt-3 text-xs leading-5 text-[#d7a49f]"
                    >
                      {checkout.error instanceof Error
                        ? checkout.error.message
                        : status}
                    </p>
                  ) : null}
                  {discordPrompt ? (
                    <div className="mt-4 rounded-[12px] border border-[#5865f2]/35 bg-[#5865f2]/10 p-4">
                      <div className="flex items-start gap-3">
                        <MessageCircle
                          size={20}
                          strokeWidth={2.1}
                          className="mt-0.5 shrink-0 text-[#8b95ff]"
                        />
                        <div>
                          <p className="text-sm font-bold text-white">
                            Verify Discord before checkout
                          </p>
                          <p className="mt-1.5 text-xs leading-5 text-[#aaa]">
                            Discord shares only your verified user ID and
                            profile. Tebex uses it for Discord purchase actions;
                            your CFX account remains the main purchaser account.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="button-primary mt-4 w-full bg-[#5865f2]!"
                        onClick={() => void continueWithDiscord()}
                        disabled={discordPending}
                      >
                        {discordPending ? (
                          <LoaderCircle
                            size={18}
                            strokeWidth={2.2}
                            className="animate-spin"
                          />
                        ) : (
                          <ShieldCheck size={18} strokeWidth={2.2} />
                        )}
                        {discordPending
                          ? "Opening Discord..."
                          : "Continue with Discord"}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full text-xs font-semibold text-[#999] transition-colors hover:text-white"
                        onClick={() => setDiscordPrompt(false)}
                        disabled={discordPending}
                      >
                        Not now
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="button-primary mt-4 w-full"
                      onClick={() => checkout.mutate()}
                      disabled={checkout.isPending}
                    >
                      {checkout.isPending ? (
                        <LoaderCircle
                          size={18}
                          strokeWidth={2.2}
                          className="animate-spin"
                        />
                      ) : (
                        <LockKeyhole size={18} strokeWidth={2.2} />
                      )}
                      <span>
                        {checkout.isPending
                          ? "Preparing checkout..."
                          : "Secure checkout"}
                      </span>
                      <ArrowRight size={17} strokeWidth={2.2} />
                    </button>
                  )}
                  <p className="mt-3 text-center text-[11px] leading-4 text-[#777]">
                    Checkout and payment are securely handled by Tebex.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
