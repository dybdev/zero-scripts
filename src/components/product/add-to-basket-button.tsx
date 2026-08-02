"use client";

import {
  Check,
  LoaderCircle,
  MessageCircle,
  Plus,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useBuyerAuth } from "@/components/account/auth-provider";
import { useOverlay } from "@/hooks/use-overlay";
import type { Product } from "@/lib/tebex/types";
import { cn } from "@/lib/utils";
import { useBasketStore } from "@/stores/basket-store";

export function AddToBasketButton({
  product,
  compact = false,
  fullLabel = false,
  className,
}: {
  product: Product;
  compact?: boolean;
  fullLabel?: boolean;
  className?: string;
}) {
  const addItem = useBasketStore((state) => state.addItem);
  const { authenticated, discordVerified, requestSignIn } = useBuyerAuth();
  const [added, setAdded] = useState(false);
  const [discordOpen, setDiscordOpen] = useState(false);
  const [discordPending, setDiscordPending] = useState(false);
  const closeDiscord = useCallback(() => {
    if (!discordPending) setDiscordOpen(false);
  }, [discordPending]);
  const modalRef = useOverlay(discordOpen, closeDiscord);

  const finishAdd = useCallback(
    (item: Product) => {
      addItem(item);
      setAdded(true);
      toast.success(`${item.name} added to your basket.`, {
        toastId: `basket-${item.id}`,
      });
      window.setTimeout(() => setAdded(false), 1200);
    },
    [addItem],
  );

  useEffect(() => {
    if (!discordVerified) return;
    const pending = window.sessionStorage.getItem("zero_pending_product");
    if (!pending) return;
    try {
      const pendingProduct = JSON.parse(pending) as Product;
      if (pendingProduct.id !== product.id) return;
      window.sessionStorage.removeItem("zero_pending_product");
      const timeoutId = window.setTimeout(() => finishAdd(pendingProduct), 0);
      return () => window.clearTimeout(timeoutId);
    } catch {
      window.sessionStorage.removeItem("zero_pending_product");
    }
  }, [discordVerified, finishAdd, product.id]);

  const add = () => {
    if (!authenticated) {
      requestSignIn();
      toast.info("Sign in with CFX before adding products to your bag.", {
        toastId: "basket-auth-required",
      });
      return;
    }
    if (!discordVerified) {
      setDiscordOpen(true);
      return;
    }
    finishAdd(product);
  };

  const continueWithDiscord = async () => {
    setDiscordPending(true);
    try {
      window.sessionStorage.setItem(
        "zero_pending_product",
        JSON.stringify(product),
      );
      const returnTo = `${window.location.pathname}${window.location.search}`;
      const response = await fetch("/api/auth/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnTo }),
      });
      const body = (await response.json()) as {
        authUrl?: string;
        message?: string;
      };
      if (!response.ok || !body.authUrl) {
        throw new Error(
          body.message ?? "Discord verification could not be started.",
        );
      }
      window.location.assign(body.authUrl);
    } catch (error) {
      window.sessionStorage.removeItem("zero_pending_product");
      toast.error(
        error instanceof Error
          ? error.message
          : "Discord verification could not be started.",
      );
      setDiscordPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={add}
        className={cn(
          "button-primary",
          compact ? "min-h-10 px-3 text-xs" : "",
          className,
        )}
        aria-label={`Add ${product.name} to bag`}
      >
        {added ? (
          <Check size={17} strokeWidth={2.2} aria-hidden />
        ) : fullLabel ? (
          <ShoppingBag size={18} strokeWidth={2.2} aria-hidden />
        ) : (
          <Plus size={17} strokeWidth={2.2} aria-hidden />
        )}
        <span>
          {added
            ? "Added"
            : product.price === 0
              ? "Get free"
              : fullLabel
                ? "Add to bag"
                : "Add"}
        </span>
      </button>
      <AnimatePresence>
        {discordOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Cancel Discord verification"
              className="fixed inset-0 z-80 cursor-default bg-black/75 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDiscord}
            />
            <motion.section
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`discord-product-${product.id}`}
              className="fixed top-1/2 left-1/2 z-90 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-white/10 bg-[#151515] p-6 shadow-2xl"
              initial={{ opacity: 0, y: "-46%", scale: 0.98 }}
              animate={{ opacity: 1, y: "-50%", scale: 1 }}
              exit={{ opacity: 0, y: "-46%", scale: 0.98 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#5865f2] text-white">
                  <MessageCircle size={24} strokeWidth={2} />
                </div>
                <button
                  type="button"
                  className="icon-button"
                  onClick={closeDiscord}
                  disabled={discordPending}
                  aria-label="Close Discord verification"
                >
                  <X size={18} strokeWidth={2.2} />
                </button>
              </div>
              <h2
                id={`discord-product-${product.id}`}
                className="mt-5 text-xl font-bold text-white"
              >
                Verify Discord to add this product
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#aaa]">
                Tebex needs your verified Discord ID for purchase logging and
                configured Discord actions. Your CFX account remains the main
                FiveM purchaser identity.
              </p>
              <button
                type="button"
                className="button-primary mt-6 w-full bg-[#5865f2]!"
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
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
