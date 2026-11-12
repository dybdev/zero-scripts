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
        "font-mono font-medium text-[var(--foreground)] tabular-nums",
        className,
      )}
    >
      {amount === 0 ? "Free" : formatPrice(amount, currency)}
    </span>
  );
}
