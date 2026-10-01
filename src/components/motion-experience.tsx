"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "motion/react";
import {
  Pause,
  Play,
  ArrowUpRight,
  Check,
  Lightbulb,
  LayoutTemplate,
  Rocket,
} from "lucide-react";
import type { Locale } from "@/lib/content";

const Experience = createContext({ paused: false, visible: true });
const ease = [0.23, 1, 0.32, 1] as const;

export function MotionExperience({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();
  const path = usePathname().replace(/^\/(en|es)(?=\/|$)/, "") || "/";
  const marketing = /^(\/|\/services(?:\/.*)?|\/about|\/how-it-works)$/.test(
    path,
  );
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return (
    <Experience.Provider value={{ paused: paused || !!reduce, visible }}>
      {children}
      {marketing && (
        <button
          className="motion-control"
          type="button"
          aria-pressed={paused}
          disabled={!!reduce}
          onClick={() => setPaused(!paused)}
        >
          {paused || reduce ? <Play size={14} /> : <Pause size={14} />}
          {reduce
            ? locale === "es"
              ? "Movimiento reducido"
              : "Reduced motion"
            : paused
              ? locale === "es"
                ? "Activar animaciones"
                : "Play animations"
              : locale === "es"
                ? "Pausar animaciones"
                : "Pause animations"}
        </button>
      )}
    </Experience.Provider>
  );
}

export function useMotionPreference() {
  const { paused } = useContext(Experience);
  const reduce = useReducedMotion();
  return paused || !!reduce;
}

export function CatalogEntrance({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const calm = useMotionPreference();
  return (
    <motion.div
      className="catalog-entrance"
      initial={
        calm
          ? false
          : { opacity: 0.9, transform: `translateX(${index % 2 ? -36 : 36}px)` }
      }
      whileInView={{ opacity: 1, transform: "translateX(0)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: calm ? 0 : 0.65, ease }}
    >
      {children}
    </motion.div>
  );
}

export function useSceneMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "80px" });
  const { paused, visible } = useContext(Experience);
  const reduce = useReducedMotion();
  return {
    ref,
    running: inView && visible && !paused && !reduce,
    reduced: !!reduce,
    paused,
  };
}

export function AnimatedScene({
  children,
  kind,
  className = "",
}: {
  children: ReactNode;
  kind: string;
  className?: string;
}) {
  const { ref, running } = useSceneMotion();
  return (
    <div
      ref={ref}
      className={"animated-scene scene-" + kind + " " + className}
      data-running={running}
    >
      {children}
    </div>
  );
}

export function ServiceRibbon({
  locale,
  labels,
}: {
  locale: Locale;
  labels: string[];
}) {
  const { ref, running } = useSceneMotion();
  return (
    <div
      ref={ref}
      className="service-ribbon"
      data-running={running}
      aria-label={locale === "es" ? "Lo que construimos" : "What we build"}
    >
      <div className="ribbon-track">
        {[0, 1].map((copy) => (
          <div
            className="ribbon-group"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {labels.map((label) => (
              <span key={label}>
                <span aria-hidden="true">✳</span>
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScrollStory({
  locale,
  steps,
  compact = false,
}: {
  locale: Locale;
  steps: readonly { title: string; body: string }[];
  compact?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { paused } = useContext(Experience);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const [stage, setStage] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!paused && !reduce) setStage(Math.min(2, Math.floor(value * 3)));
  });
  const fill = useTransform(scrollYProgress, (v) => "scaleX(" + v + ")");
  const names =
    locale === "es"
      ? ["Idea", "Estructura", "Realidad"]
      : ["Idea", "Structure", "Reality"];
  const icons = [Lightbulb, LayoutTemplate, Rocket];
  const active = reduce || paused ? 2 : stage;
  return (
    <div
      ref={ref}
      className={"scroll-story" + (compact ? " story-compact" : "")}
    >
      <div className="story-sticky">
        <div className="story-blueprint" aria-hidden="true">
          <div className="story-window-top">
            <span />
            <span />
            <span />
            <small>ImpulsArte / {names[active]}</small>
          </div>
          <div className="story-canvas">
            <motion.div
              className="story-idea"
              animate={{
                opacity: active === 0 ? 1 : 0,
                transform:
                  active === 0
                    ? "scale(1) rotate(-4deg)"
                    : "scale(.95) rotate(0deg)",
              }}
              transition={{ duration: reduce || paused ? 0 : 0.45, ease }}
            >
              <Lightbulb size={38} />
              <strong>
                {locale === "es" ? "¿Y si lo hacemos?" : "What if we build it?"}
              </strong>
              <span className="idea-stroke" />
              <span className="idea-stroke short" />
            </motion.div>
            <motion.div
              className="story-product"
              animate={{
                opacity: active >= 1 ? 1 : 0,
                transform:
                  active >= 1
                    ? "translateY(0) scale(1)"
                    : "translateY(24px) scale(.96)",
              }}
              transition={{ duration: reduce || paused ? 0 : 0.55, ease }}
            >
              <div
                className={
                  "story-product-banner " + (active === 2 ? "is-built" : "")
                }
              >
                <span />
                <strong>
                  {active === 2
                    ? locale === "es"
                      ? "Tu idea, en marcha."
                      : "Your idea, in motion."
                    : locale === "es"
                      ? "Cada pieza, en su lugar."
                      : "Every piece in place."}
                </strong>
                <span />
              </div>
              <div className="story-product-blocks">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      transform:
                        active === 2
                          ? "translateY(0)"
                          : "translateY(" + (i % 2 ? 10 : -8) + "px)",
                    }}
                    transition={{
                      duration: reduce || paused ? 0 : 0.55,
                      delay: reduce || paused ? 0 : i * 0.06,
                      ease,
                    }}
                  >
                    <span />
                    <span />
                    <span />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.span
              className="story-launch"
              animate={{
                opacity: active === 2 ? 1 : 0,
                transform:
                  active === 2
                    ? "translateY(0) rotate(-6deg)"
                    : "translateY(16px) rotate(-6deg)",
              }}
              transition={{ duration: reduce || paused ? 0 : 0.4, ease }}
            >
              <Check size={16} />
              {locale === "es" ? "Listo para avanzar" : "Ready to move forward"}
            </motion.span>
          </div>
        </div>
        <div className="story-phases">
          {names.map((name, i) => {
            const Icon = icons[i];
            return (
              <span key={name} data-active={i === active}>
                <Icon size={16} />
                {name}
              </span>
            );
          })}
        </div>
        <div className="story-meter">
          <motion.span
            style={{ transform: reduce || paused ? "scaleX(1)" : fill }}
          />
        </div>
        <p className="story-scroll-hint">
          {locale === "es"
            ? "Tu idea toma forma con cada paso."
            : "Your idea takes shape with every step."}
          <ArrowUpRight size={16} />
        </p>
      </div>
      <div className="story-chapters">
        {steps.map((step, i) => (
          <article
            key={step.title}
            className="story-chapter"
            data-active={active === i}
          >
            <span className="story-chapter-number">0{i + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
