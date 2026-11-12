import { Children } from "react";

import { cn } from "@/lib/utils";

/**
 * Plays once on load: each direct child rises into place in sequence.
 * Pure CSS so the first screen is never hidden while JavaScript loads,
 * and it rests immediately for reduced-motion visitors.
 */
export function HeroEntrance({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={cn("hero-enter", className)}>
      {Children.map(children, (child, index) => (
        <div style={{ animationDelay: `${delay + index * 0.08}s` }}>
          {child}
        </div>
      ))}
    </div>
  );
}
