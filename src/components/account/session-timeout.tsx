"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

import { useBasketStore } from "@/stores/basket-store";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const ACTIVITY_WRITE_INTERVAL_MS = 15 * 1000;
const LAST_ACTIVITY_KEY = "zero-scripts-last-activity";
const SESSION_EXPIRED_KEY = "zero-scripts-session-expired";

export function SessionTimeout({ authenticated }: { authenticated: boolean }) {
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get("session") === "expired") {
      toast.info(
        "Your session expired after 30 minutes of inactivity. Please sign in again.",
        {
          toastId: "session-expired",
        },
      );
      currentUrl.searchParams.delete("session");
      window.history.replaceState(null, "", currentUrl);
    }

    let expiring = false;
    let lastWrite = 0;

    if (!authenticated) {
      useBasketStore.setState({ items: [], isOpen: false });
      useBasketStore.persist.clearStorage();
      window.sessionStorage.removeItem("zero_pending_product");
    }

    const clearSession = async (broadcast = true) => {
      if (expiring) return;
      expiring = true;

      useBasketStore.setState({ items: [], isOpen: false });
      useBasketStore.persist.clearStorage();
      window.sessionStorage.removeItem("zero_pending_product");
      window.localStorage.removeItem(LAST_ACTIVITY_KEY);
      if (broadcast) {
        window.localStorage.setItem(SESSION_EXPIRED_KEY, String(Date.now()));
      }

      await Promise.allSettled([
        fetch("/api/tebex/auth", { method: "DELETE" }),
        fetch("/api/auth/discord", { method: "DELETE" }),
      ]);
      window.location.assign("/?session=expired");
    };

    const checkIdle = () => {
      const lastActivity = Number(
        window.localStorage.getItem(LAST_ACTIVITY_KEY),
      );
      if (lastActivity && Date.now() - lastActivity >= IDLE_TIMEOUT_MS) {
        void clearSession();
      }
    };

    const recordActivity = () => {
      if (expiring) return;
      const now = Date.now();
      if (now - lastWrite < ACTIVITY_WRITE_INTERVAL_MS) return;
      lastWrite = now;
      window.localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkIdle();
        if (!expiring) recordActivity();
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === SESSION_EXPIRED_KEY && event.newValue) {
        void clearSession(false);
      }
    };

    if (!window.localStorage.getItem(LAST_ACTIVITY_KEY)) {
      recordActivity();
    } else {
      checkIdle();
    }

    const activityEvents: Array<keyof WindowEventMap> = [
      "keydown",
      "pointerdown",
      "scroll",
      "touchstart",
    ];
    for (const eventName of activityEvents) {
      window.addEventListener(eventName, recordActivity, { passive: true });
    }
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const intervalId = window.setInterval(checkIdle, 60 * 1000);

    return () => {
      for (const eventName of activityEvents) {
        window.removeEventListener(eventName, recordActivity);
      }
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [authenticated]);

  return null;
}
