export function CompatibilityBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-7 items-center rounded-[3px] border border-[var(--line-strong)] px-2 font-mono text-[11px] text-[var(--neutral-200)] lowercase">
      {label}
    </span>
  );
}
