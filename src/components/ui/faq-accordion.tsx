"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t border-[var(--line)]">
      {items.map(({ question, answer }, index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const triggerId = `faq-trigger-${index}`;

        return (
          <div key={question} className="border-b border-[var(--line)]">
            <button
              id={triggerId}
              type="button"
              className="group flex min-h-18 w-full items-center gap-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="index w-6 shrink-0 text-xs">
                {String.fromCharCode(97 + index)}
              </span>
              <span
                className={
                  open
                    ? "font-display flex-1 text-2xl text-white"
                    : "font-display flex-1 text-2xl text-[var(--neutral-200)] transition-colors group-hover:text-white"
                }
              >
                {question}
              </span>
              <motion.span
                className="relative grid size-5 shrink-0 place-items-center"
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                aria-hidden
              >
                <span className="absolute h-[2px] w-4 bg-[var(--brand-red)]" />
                <span className="absolute h-4 w-[2px] bg-[var(--brand-red)]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.22 },
                  }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 pl-11 text-base leading-7 text-[var(--neutral-400)]">
                    {answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
