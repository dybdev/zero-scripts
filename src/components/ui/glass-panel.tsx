import type { ElementType, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

/** Solid panel. Name kept so existing imports keep working. */
export function GlassPanel({
  as: Component = "div",
  className,
  ...props
}: GlassPanelProps) {
  return <Component className={cn("panel", className)} {...props} />;
}
