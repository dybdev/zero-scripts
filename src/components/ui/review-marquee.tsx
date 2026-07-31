import { Quote, Star } from "lucide-react";

const reviews = [
  "The setup flow was clear, fast, and easy to adapt to our server.",
  "Clean configuration and documentation made integration painless.",
  "The resource feels focused and stays out of the way of our stack.",
  "Updates are structured well and the changelog is easy to follow.",
];

function ReviewCard({ quote }: { quote: string }) {
  return (
    <article className="w-[320px] shrink-0 rounded-[14px] border border-white/8 bg-[#151515] p-6 sm:w-[390px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 text-[var(--brand-red-light)]">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={15}
              strokeWidth={2}
              fill="currentColor"
              aria-hidden
            />
          ))}
        </div>
        <Quote size={22} strokeWidth={1.8} className="text-[#555]" />
      </div>
      <p className="mt-5 text-base leading-7 font-medium text-[#e5e5e5]">
        “{quote}”
      </p>
      <p className="mt-5 text-xs font-bold tracking-[0.12em] text-[#777] uppercase">
        Development preview
      </p>
    </article>
  );
}

export function ReviewMarquee() {
  return (
    <div className="review-marquee mt-10 overflow-hidden">
      <div className="review-marquee-track flex w-max gap-4">
        {[false, true].map((duplicate) => (
          <div
            key={String(duplicate)}
            className="flex gap-4"
            aria-hidden={duplicate || undefined}
          >
            {reviews.map((quote) => (
              <ReviewCard key={`${duplicate}-${quote}`} quote={quote} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
