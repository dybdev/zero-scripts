import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="border-b border-white/6 bg-[#0f0f0f]">
      <div className="content-shell flex min-h-9 items-center justify-center gap-2 px-4 text-center text-[11px] font-medium text-[#b7b7b7]">
        <span className="size-1.5 rounded-full bg-[var(--brand-red)]" />
        <span>Signal Dispatch 1.2 is now available</span>
        <Link
          href="/store/package/signal-dispatch"
          className="inline-flex items-center gap-1 font-bold text-white hover:text-[var(--brand-red-light)]"
        >
          See release
          <ArrowRight size={11} strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  );
}
