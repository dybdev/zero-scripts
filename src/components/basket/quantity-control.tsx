"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityControl({
  quantity,
  onChange,
  disabled = false,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className="inline-flex h-11 items-center rounded-[6px] border border-white/10 bg-[#0b0b0b]"
      role="group"
      aria-label="Product quantity"
    >
      <button
        type="button"
        className="icon-button h-11! w-11! border-0! bg-transparent!"
        onClick={() => onChange(quantity - 1)}
        disabled={disabled || quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={15} strokeWidth={2.2} />
      </button>
      <span className="w-8 text-center text-sm font-bold text-white tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        className="icon-button h-11! w-11! border-0! bg-transparent!"
        onClick={() => onChange(quantity + 1)}
        disabled={disabled || quantity >= 20}
        aria-label="Increase quantity"
      >
        <Plus size={15} strokeWidth={2.2} />
      </button>
    </div>
  );
}
