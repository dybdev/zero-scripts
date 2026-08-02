"use client";

import {
  Gamepad2,
  LoaderCircle,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { ZeroLogo } from "@/components/brand/zero-logo";
import { useOverlay } from "@/hooks/use-overlay";

export function SignInModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const close = useCallback(() => onClose(), [onClose]);
  const ref = useOverlay(open, close);
  const [loading, setLoading] = useState<"cfx" | "discord" | null>(null);

  const startCfxSignIn = async () => {
    setLoading("cfx");
    try {
      const response = await fetch("/api/tebex/auth", { method: "POST" });
      const body = (await response.json()) as {
        authUrl?: string;
        message?: string;
      };
      if (!response.ok || !body.authUrl) {
        throw new Error(body.message ?? "Sign in could not be started.");
      }
      window.location.assign(body.authUrl);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Sign in could not be started.",
      );
      setLoading(null);
    }
  };

  const startDiscordSignIn = async () => {
    setLoading("discord");
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
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close sign in"
            className="fixed inset-0 z-60 cursor-default bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={close}
          />
          <motion.section
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sign-in-title"
            className="fixed inset-x-3 bottom-3 z-70 mx-auto w-[calc(100%-1.5rem)] max-w-lg rounded-[16px] border border-white/10 bg-[#151515] p-6 shadow-[0_-24px_80px_rgba(0,0,0,.55)] sm:bottom-6 sm:p-8"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "110%", opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <ZeroLogo variant="banner" className="w-36" />
              <button
                type="button"
                className="icon-button"
                onClick={close}
                aria-label="Close sign in"
              >
                <X size={19} strokeWidth={2.2} />
              </button>
            </div>
            <div className="mt-8 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-[12px] bg-[var(--brand-red)] text-white">
                <Gamepad2 size={27} strokeWidth={2} />
              </div>
              <h2
                id="sign-in-title"
                className="mt-5 text-2xl font-bold text-white"
              >
                Sign in to Zero Scripts
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[var(--neutral-400)]">
                Choose how you want to identify yourself. CFX is required by
                Tebex when you check out a FiveM resource.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void startCfxSignIn()}
              disabled={loading !== null}
              className="button-primary button-solid-red mt-7 w-full"
            >
              {loading === "cfx" ? (
                <LoaderCircle
                  size={18}
                  strokeWidth={2.2}
                  className="animate-spin"
                />
              ) : (
                <Gamepad2 size={18} strokeWidth={2.2} />
              )}
              {loading === "cfx" ? "Redirecting..." : "Continue with CFX"}
            </button>
            <button
              type="button"
              onClick={() => void startDiscordSignIn()}
              disabled={loading !== null}
              className="button-secondary mt-3 w-full"
            >
              {loading === "discord" ? (
                <LoaderCircle
                  size={18}
                  strokeWidth={2.2}
                  className="animate-spin"
                />
              ) : (
                <MessageCircle size={18} strokeWidth={2.2} />
              )}
              {loading === "discord"
                ? "Redirecting..."
                : "Continue with Discord"}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[#777]">
              <ShieldCheck
                size={15}
                strokeWidth={2}
                className="text-[var(--brand-red-light)]"
              />
              Authentication happens on the official CFX or Discord website.
            </p>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
