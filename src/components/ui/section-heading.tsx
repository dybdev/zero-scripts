import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold tracking-[0.18em] text-[var(--brand-red-light)] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl leading-tight font-bold tracking-[-0.035em] text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-[var(--neutral-400)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
