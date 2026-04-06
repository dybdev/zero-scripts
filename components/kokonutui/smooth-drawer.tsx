"use client";

/**
 * @author: @dorianbaffier
 * @description: Smooth Drawer
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { X } from 'lucide-react';
import { motion } from "motion/react";
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface SmoothDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const drawerVariants = {
  hidden: {
    y: "100%",
    opacity: 0,
    rotateX: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

export default function SmoothDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: SmoothDrawerProps) {

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <DrawerContent
        className={cn(
          'mx-auto w-full max-w-md rounded-t-2xl border border-white/10 bg-[#0b0b0b]/95 p-0 text-white shadow-xl backdrop-blur-md',
          className
        )}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-3 right-3 z-10 text-zinc-400 hover:text-white"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <motion.div
          animate="visible"
          className="mx-auto w-full max-w-md space-y-4 p-5"
          initial="hidden"
          variants={drawerVariants as any}
        >
          <DrawerHeader className="space-y-1 px-0 text-left">
            <DrawerTitle className="font-semibold text-xl tracking-tight text-white">
              {title}
            </DrawerTitle>
            {description ? (
              <DrawerDescription className="text-sm text-zinc-400">
                {description}
              </DrawerDescription>
            ) : null}
          </DrawerHeader>

          <div className="space-y-3">{children}</div>

          {footer ? <div className="pt-1">{footer}</div> : null}
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}
