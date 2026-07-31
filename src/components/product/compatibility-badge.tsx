import { CircleCheck } from "lucide-react";

export function CompatibilityBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.035] px-2.5 text-[11px] font-semibold text-[#c8c8c8]">
      <CircleCheck
        size={14}
        strokeWidth={2.2}
        className="text-[var(--brand-red-light)]"
        aria-hidden
      />
      {label}
    </span>
  );
}
