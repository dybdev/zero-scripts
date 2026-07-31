import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export function GlassPanel({
  as: Component = "div",
  className,
  ...props
}: GlassPanelProps) {
  return (
    <Component
      className={cn(
        "glass-panel rounded-[14px] border border-white/8 bg-[#151515]/86 shadow-[inset_0_1px_0_rgba(255,255,255,.045),0_20px_60px_rgba(0,0,0,.18)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
