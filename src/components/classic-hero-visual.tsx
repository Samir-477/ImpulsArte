"use client";

import { useEffect, useState } from "react";
import { Check, Lightbulb, LayoutTemplate, Rocket } from "lucide-react";
import { motion } from "motion/react";
import type { Locale } from "@/lib/content";
import { ScrollFloat } from "@/components/marketing-motion";
import { useSceneMotion } from "@/components/motion-experience";

const ease = [0.23, 1, 0.32, 1] as const;

export function ClassicHeroVisual({ locale }: { locale: Locale }) {
  const { ref, running, reduced } = useSceneMotion();
  const [stage, setStage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [chosenByVisitor, setChosenByVisitor] = useState(false);
  useEffect(() => {
    if (!running || hovered || chosenByVisitor) return;
    const timer = window.setInterval(
      () => setStage((value) => (value + 1) % 3),
      3600,
    );
    return () => window.clearInterval(timer);
  }, [running, hovered, chosenByVisitor]);
  const stages =
    locale === "es"
      ? [
          "Una idea con posibilidades.",
          "Un plan que conecta las piezas.",
          "Tu proyecto toma forma aquí.",
        ]
      : [
          "An idea with possibilities.",
          "A plan that connects the pieces.",
          "Your project takes shape here.",
        ];
  const names =
    locale === "es"
      ? ["Idea", "Diseño", "Lanzamiento"]
      : ["Idea", "Design", "Launch"];
  const icons = [Lightbulb, LayoutTemplate, Rocket];
  const active = reduced ? 2 : stage;
  return (
    <ScrollFloat className="hero-motion" distance={36}>
      <div
        ref={ref}
        className="hero-visual animated-scene scene-hero"
        data-running={running && !hovered && !chosenByVisitor}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setHovered(false);
        }}
      >
        <div className="visual-orbit orbit-one" />
        <div className="visual-orbit orbit-two" />
        <div className="visual-path" />
        <motion.div
          className="visual-card visual-card-main"
          initial={false}
          animate={{
            transform: reduced
              ? "rotate(-5deg)"
              : [
                  "translateY(0) rotate(-5deg)",
                  "translateY(-8px) rotate(-4deg)",
                  "translateY(0) rotate(-5deg)",
                ],
          }}
          transition={{
            duration: running && !hovered ? 7.2 : 0,
            repeat: running && !hovered ? Infinity : 0,
            ease: [0.77, 0, 0.175, 1],
          }}
        >
          <div className="visual-card-top">
            <span className="visual-dots">
              <i />
              <i />
              <i />
            </span>
            <span>ImpulsArte / {locale === "es" ? "proyecto" : "project"}</span>
          </div>
          <div className="visual-card-content">
            <span className="visual-card-label">
              {locale === "es"
                ? "DE LA IDEA A LO REAL"
                : "FROM IDEA TO REALITY"}
            </span>
            <div className="hero-stage-headings" aria-hidden="true">
              {stages.map((text, i) => (
                <motion.strong
                  key={text}
                  initial={false}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    transform:
                      active === i
                        ? "translateY(0)"
                        : reduced
                          ? "none"
                          : "translateY(14px)",
                  }}
                  transition={{ duration: reduced ? 0 : 0.45, ease }}
                >
                  {text}
                </motion.strong>
              ))}
            </div>
            <span className="sr-only">{stages[2]}</span>
            <div
              className={"hero-build-preview preview-stage-" + active}
              aria-hidden="true"
            >
              <div className="preview-heading" />
              <div className="preview-line" />
              <div className="preview-tiles">
                {[0, 1, 2].map((i) => (
                  <motion.i
                    key={i}
                    initial={false}
                    animate={{
                      opacity: active === 0 ? 0.3 : 1,
                      transform: reduced
                        ? "none"
                        : active === 0
                          ? "translateY(" +
                            (i % 2 ? 12 : -6) +
                            "px) rotate(" +
                            (i % 2 ? 5 : -4) +
                            "deg)"
                          : "translateY(0) rotate(0deg)",
                    }}
                    transition={{
                      duration: reduced ? 0 : 0.55,
                      delay: reduced ? 0 : i * 0.06,
                      ease,
                    }}
                  >
                    <span />
                  </motion.i>
                ))}
              </div>
              <motion.span
                className="preview-ready"
                initial={false}
                animate={{ opacity: active === 2 ? 1 : 0 }}
                transition={{ duration: 0.25, ease }}
              >
                <Check size={12} />
                {locale === "es" ? "Listo" : "Ready"}
              </motion.span>
            </div>
            <div className="visual-progress">
              <motion.i
                initial={false}
                animate={{ transform: "scaleX(" + (active + 1) / 3 + ")" }}
                transition={{ duration: reduced ? 0 : 0.65, ease }}
                style={{ transformOrigin: "left center" }}
              />
            </div>
            <div
              className="hero-stage-controls"
              aria-label={
                locale === "es"
                  ? "Etapas del proyecto ilustrado"
                  : "Illustrated project stages"
              }
            >
              {names.map((name, i) => {
                const Icon = icons[i];
                return (
                  <button
                    type="button"
                    key={name}
                    aria-pressed={active === i}
                    onClick={() => {
                      setChosenByVisitor(true);
                      setStage(i);
                    }}
                    disabled={reduced}
                  >
                    <Icon size={13} />
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
        <div className="visual-pill visual-pill-one">
          <span className="pill-spark">✳</span>
          {locale === "es" ? "Diseñado para vos" : "Built around you"}
        </div>
        <div className="visual-pill visual-pill-two">
          <span className="pill-check">
            <Check size={14} />
          </span>
          {locale === "es" ? "Paso a paso" : "Step by step"}
        </div>
        <span className="visual-caption">
          {locale === "es"
            ? "Una forma más simple de construir."
            : "A simpler way to build."}
        </span>
      </div>
    </ScrollFloat>
  );
}
