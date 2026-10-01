"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useMotionPreference } from "@/components/motion-experience";

export function ScrollProgress() {
  const reduce = useMotionPreference();
  const { scrollYProgress } = useScroll();
  const transform = useTransform(
    scrollYProgress,
    (value) => `scaleX(${value})`,
  );
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress"
      style={{ transform }}
    />
  );
}

export function ScrollFloat({
  children,
  className,
  distance = 18,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [`translateY(${distance}px)`, `translateY(-${distance}px)`],
  );
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transform: reduce ? "none" : transform }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const transform = useTransform(
    scrollYProgress,
    (value) => `scaleY(${value})`,
  );
  return (
    <div ref={ref} className="process-sequence">
      {!reduce && (
        <motion.span
          className="process-sequence-progress"
          aria-hidden="true"
          style={{ transform }}
        />
      )}
      {children}
    </div>
  );
}
