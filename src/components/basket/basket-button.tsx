"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect } from "react";

import { useBasketStore } from "@/stores/basket-store";

export function BasketButton() {
  const open = useBasketStore((state) => state.open);
  const count = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  useEffect(() => {
    void useBasketStore.persist.rehydrate();
  }, []);

  return (
    <button
      type="button"
      className="basket-trigger relative"
      onClick={open}
      aria-label={`Open basket, ${count} items`}
    >
      <ShoppingBag size={22} strokeWidth={2.2} />
      {count > 0 ? (
        <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-bold text-[var(--brand-red)] tabular-nums">
          {count}
        </span>
      ) : null}
    </button>
  );
}
