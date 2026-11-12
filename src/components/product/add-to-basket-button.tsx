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
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

import { useBuyerAuth } from "@/components/account/auth-provider";
import { ZeroLogo } from "@/components/brand/zero-logo";
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
  const portalReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
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
        toastId: "basket-cfx-required",
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={added ? "added" : "idle"}
            className="inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {added ? (
              <Check size={17} strokeWidth={2.2} aria-hidden />
            ) : fullLabel ? (
              <ShoppingBag size={17} strokeWidth={2.2} aria-hidden />
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
          </motion.span>
        </AnimatePresence>
      </button>
      {portalReady
        ? createPortal(
            <AnimatePresence>
              {discordOpen ? (
                <>
                  <motion.button
                    type="button"
                    aria-label="Cancel Discord verification"
                    className="fixed inset-0 z-80 cursor-default bg-black/75"
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
                    className="fixed inset-x-3 bottom-3 z-90 mx-auto w-[calc(100%-1.5rem)] max-w-lg rounded-[6px] border border-[var(--line-strong)] bg-[var(--surface)] p-6 shadow-[0_-24px_80px_rgba(0,0,0,.55)] sm:bottom-6 sm:p-8"
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "110%", opacity: 0 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <ZeroLogo variant="banner" className="w-36" />
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
                    <div className="mt-8 text-center">
                      <div className="mx-auto grid size-14 place-items-center rounded-[6px] bg-[#5865f2] text-white">
                        <MessageCircle size={27} strokeWidth={2} />
                      </div>
                      <h2
                        id={`discord-product-${product.id}`}
                        className="mt-5 text-2xl font-bold text-white"
                      >
                        Verify Discord to add this product
                      </h2>
                      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#aaa]">
                        Tebex needs your verified Discord ID for purchase
                        logging and configured Discord actions. Your CFX account
                        remains the main FiveM purchaser identity.
                      </p>
                    </div>
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
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
