"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useMotionPreference } from "@/components/motion-experience";

const easeOut = [0.23, 1, 0.32, 1] as const;

export function ServiceEntrance({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const reduce = useMotionPreference();
  return (
    <motion.div
      className="service-entrance"
      initial={
        reduce ? false : { opacity: 0.82, transform: "translate3d(0, 62px, 0)" }
      }
      whileInView={{ opacity: 1, transform: "translate3d(0, 0px, 0)" }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{
        duration: reduce ? 0 : 0.72,
        delay: reduce ? 0 : index * 0.06,
        ease: easeOut,
      }}
    >
      <motion.div
        className="service-interaction"
        whileHover={
          reduce
            ? undefined
            : { transform: "translate3d(0, -10px, 0) rotate(-0.7deg)" }
        }
        whileTap={
          reduce
            ? undefined
            : { transform: "translate3d(0, -3px, 0) scale(0.985)" }
        }
        transition={{ duration: reduce ? 0 : 0.2, ease: easeOut }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function ProcessTimeline({
  steps,
}: {
  steps: readonly { readonly title: string; readonly body: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 45%"],
  });
  const progress = useTransform(scrollYProgress, (value) => `scaleY(${value})`);
  return (
    <div ref={ref} className="process-steps process-timeline">
      {!reduce && (
        <motion.span
          className="process-timeline-progress"
          style={{ transform: progress }}
          aria-hidden="true"
        />
      )}
      {steps.map((step, index) => (
        <motion.div
          className="process-step"
          key={step.title}
          initial={
            reduce
              ? false
              : { opacity: 0.7, transform: "translate3d(18px, 0, 0)" }
          }
          whileInView={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          viewport={{ once: true, amount: 0.65 }}
          transition={{ duration: 0.55, ease: easeOut }}
        >
          <span className="step-number">0{index + 1}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
