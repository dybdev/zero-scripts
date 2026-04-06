"use client";

/**
 * @author: @dorianbaffier
 * @description: Dynamic Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Greeting {
  text: string;
  language: string;
}

interface DynamicTextProps {
  greetings?: Greeting[];
  intervalMs?: number;
  className?: string;
  containerClassName?: string;
}

const defaultGreetings: Greeting[] = [
  { text: "Hello", language: "English" },
  { text: "こんにちは", language: "Japanese" },
  { text: "Bonjour", language: "French" },
  { text: "Hola", language: "Spanish" },
  { text: "안녕하세요", language: "Korean" },
  { text: "Ciao", language: "Italian" },
  { text: "Hallo", language: "German" },
  { text: "こんにちは", language: "Japanese" },
];

const DynamicText = ({
  greetings = defaultGreetings,
  intervalMs = 600,
  className,
  containerClassName,
}: DynamicTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (greetings.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex >= greetings.length) {
          clearInterval(interval);
          return 0;
        }

        return nextIndex;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [greetings, intervalMs]);

  // Animation variants for the text
  const textVariants = {
    hidden: { y: 8, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -8, opacity: 0 },
  };

  return (
    <span
      aria-label="Dynamic text"
      className={cn(
        "relative inline-flex h-[1.2em] items-center justify-center overflow-hidden align-middle leading-none",
        containerClassName
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          animate={textVariants.visible}
          aria-live="off"
          className={cn("inline-flex items-center whitespace-nowrap leading-none", className)}
          exit={textVariants.exit}
          initial={textVariants.hidden}
          key={`${greetings[currentIndex]?.language ?? 'none'}-${currentIndex}`}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {greetings[currentIndex]?.text ?? ""}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default DynamicText;
