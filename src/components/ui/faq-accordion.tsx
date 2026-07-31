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
    <div className="space-y-3">
      {items.map(({ question, answer }, index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const triggerId = `faq-trigger-${index}`;

        return (
          <div
            key={question}
            className="overflow-hidden rounded-[12px] bg-[#151515]"
          >
            <button
              id={triggerId}
              type="button"
              className="flex min-h-16 w-full items-center justify-between gap-4 px-5 text-left text-base font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--brand-red)]"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span>{question}</span>
              <motion.span
                className="text-xl font-medium text-[var(--brand-red-light)]"
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                aria-hidden
              >
                +
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
                    height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.18 },
                  }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl px-5 pb-5 text-sm leading-7 text-[var(--neutral-400)]">
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
