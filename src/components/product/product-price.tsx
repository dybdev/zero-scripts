import { cn, formatPrice } from "@/lib/utils";

export function ProductPrice({
  amount,
  currency,
  className,
}: {
  amount: number;
  currency: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-bold text-white tabular-nums",
        amount > 0 && "text-[var(--brand-red-light)]",
        className,
      )}
    >
      {amount === 0 ? "Free" : formatPrice(amount, currency)}
    </span>
  );
}
