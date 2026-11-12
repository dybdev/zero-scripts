import { cn } from "@/lib/utils";

/**
 * Field-manual heading: a red index number, a condensed title with a red
 * underline, and an optional lowercase mono note beside it.
 * `eyebrow` is kept for compatibility and rendered as that note.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      <div
        className={cn(
          "flex flex-wrap items-baseline gap-x-4 gap-y-2",
          align === "center" && "justify-center",
        )}
      >
        {index ? <span className="index text-lg">{index}</span> : null}
        <h2 className="mark text-[clamp(2.25rem,4.4vw,3.5rem)] text-white">
          {title}
        </h2>
        {eyebrow ? <span className="note lowercase">{eyebrow}</span> : null}
      </div>
      {description ? (
        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--neutral-400)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
