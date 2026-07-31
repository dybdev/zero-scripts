"use client";

import { Check, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { useBuyerAuth } from "@/components/account/auth-provider";
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
  const { authenticated, requestSignIn } = useBuyerAuth();
  const [added, setAdded] = useState(false);

  const add = () => {
    if (!authenticated) {
      requestSignIn();
      toast.info("Sign in with Discord before adding products to your bag.", {
        toastId: "basket-auth-required",
      });
      return;
    }
    addItem(product);
    setAdded(true);
    toast.success(`${product.name} added to your basket.`, {
      toastId: `basket-${product.id}`,
    });
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
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
  );
}
