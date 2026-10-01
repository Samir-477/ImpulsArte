"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Compass, Code2 } from "lucide-react";
import { useMotionPreference } from "@/components/motion-experience";
import type { Locale } from "@/lib/content";

const ServiceShowcaseCanvas = dynamic(
  () => import("@/components/service-showcase-canvas"),
  { ssr: false },
);

const copy = {
  es: {
    eyebrow: "De la pregunta al próximo paso",
    title: "Una idea puede tomar muchas formas.",
    intro:
      "Exploramos lo que necesita tu negocio, elegimos un rumbo digital y construimos lo que realmente ayuda a avanzar.",
    prompt: "Elegí una dirección para explorar",
    steps: [
      {
        title: "Servicios empresariales",
        body: "Partimos de tu objetivo y organizamos una propuesta útil para tu contexto.",
        note: "Entender el objetivo",
      },
      {
        title: "Consultoría digital",
        body: "Comparamos posibilidades digitales y definimos un camino claro para decidir.",
        note: "Encontrar el rumbo",
      },
      {
        title: "Desarrollo digital",
        body: "Convertimos el plan acordado en una experiencia digital que se puede usar.",
        note: "Hacerlo real",
      },
    ],
  },
  en: {
    eyebrow: "From the question to the next step",
    title: "An idea can take many shapes.",
    intro:
      "We explore what your business needs, choose a digital direction, and build what helps you move forward.",
    prompt: "Choose a direction to explore",
    steps: [
      {
        title: "Business services",
        body: "We start with your goal and shape a useful proposal for your context.",
        note: "Understand the goal",
      },
      {
        title: "Digital consultancy",
        body: "We compare digital possibilities and find a clear path for decisions.",
        note: "Find the direction",
      },
      {
        title: "Digital development",
        body: "We turn the agreed plan into a digital experience people can use.",
        note: "Make it real",
      },
    ],
  },
} as const;

const icons = [BriefcaseBusiness, Compass, Code2];

export function ServiceShowcase({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [selected, setSelected] = useState(0);
  const [canRender, setCanRender] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const calm = useMotionPreference();
  const visual = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = visual.current;
    if (!node || calm || !window.matchMedia("(min-width: 760px)").matches)
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting || canRender) return;
        try {
          const probe = document.createElement("canvas");
          if (probe.getContext("webgl2") || probe.getContext("webgl")) {
            setCanRender(true);
          }
        } catch {
          // The CSS poster remains usable without WebGL.
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [calm, canRender]);

  const Icon = icons[selected];
  return (
    <section className="service-showcase" aria-labelledby="showcase-title">
      <div className="container service-showcase-grid">
        <div className="service-showcase-copy">
          <p className="section-overline">{t.eyebrow}</p>
          <h2 id="showcase-title">{t.title}</h2>
          <p className="service-showcase-intro">{t.intro}</p>
          <p className="service-showcase-prompt">{t.prompt}</p>
          <div
            className="service-showcase-options"
            role="group"
            aria-label={t.prompt}
          >
            {t.steps.map((step, index) => {
              const StepIcon = icons[index];
              return (
                <button
                  type="button"
                  key={step.title}
                  aria-pressed={selected === index}
                  onClick={() => setSelected(index)}
                >
                  <span className="service-showcase-option-icon">
                    <StepIcon size={21} />
                  </span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.body}</small>
                  </span>
                  <span className="service-showcase-option-number">
                    0{index + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div
          className="service-showcase-visual"
          ref={visual}
          data-stage={selected}
        >
          <div className="service-showcase-visual-top">
            <span>ImpulsArte / {t.steps[selected].note}</span>
            <span>0{selected + 1} / 03</span>
          </div>
          <div
            className="service-showcase-art"
            aria-hidden="true"
            data-webgl-ready={ready}
          >
            <div className="service-showcase-poster">
              <span className="showcase-poster-orbit" />
              <span className="showcase-poster-sheet sheet-back" />
              <span className="showcase-poster-sheet sheet-front">
                <Icon size={54} strokeWidth={1.25} />
              </span>
              <span className="showcase-poster-dot dot-one" />
              <span className="showcase-poster-dot dot-two" />
            </div>
            {canRender && !calm && (
              <ServiceShowcaseCanvas
                selected={selected}
                active={inView}
                onReady={() => setReady(true)}
              />
            )}
          </div>
          <div className="service-showcase-visual-bottom">
            <span>{t.steps[selected].note}</span>
            <span aria-hidden="true">✳</span>
          </div>
        </div>
      </div>
    </section>
  );
}
