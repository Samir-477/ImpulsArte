"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  ArrowUpRight,
  Lightbulb,
  Route,
  Code2,
  MessageSquare,
  PackageCheck,
} from "lucide-react";
import { useMotionPreference } from "@/components/motion-experience";
import { processStory } from "@/lib/process-story";
import type { Locale } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export function DetailedProcessStory({ locale }: { locale: Locale }) {
  const t = processStory[locale];
  const ref = useRef<HTMLDivElement>(null);
  const calm = useMotionPreference();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (calm || !ref.current) return;
    const root = ref.current;
    const chapters = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".journey-chapter"),
    );
    const context = gsap.context(() => {
      chapters.forEach((chapter, index) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 52%",
          end: "bottom 52%",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });
      gsap.fromTo(
        ".journey-progress-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".journey-chapters",
            start: "top 52%",
            end: "bottom 52%",
            scrub: 0.35,
          },
        },
      );
    }, root);
    return () => context.revert();
  }, [calm, locale]);
  const icons = [Lightbulb, Route, Code2, MessageSquare, PackageCheck];
  const Icon = icons[active];
  return (
    <>
      <div className="journey-heading">
        <h2>{t.title}</h2>
        <p>{t.intro}</p>
      </div>
      <div className="detailed-journey" ref={ref}>
        <aside className="journey-desk">
          <span className="journey-progress" aria-hidden="true">
            <span className="journey-progress-fill" />
          </span>
          <div className="journey-desk-top">
            <span>ImpulsArte</span>
            <span>{t.desk}</span>
          </div>
          <div
            className="journey-artifact"
            aria-hidden="true"
            data-stage={active}
          >
            <span className="desk-pencil" />
            <div className="desk-back-sheet" />
            <motion.div
              className="desk-main-sheet"
              initial={false}
              animate={{
                transform: calm
                  ? "none"
                  : "rotate(" + (active % 2 ? 2 : -2) + "deg)",
              }}
              transition={{
                duration: calm ? 0 : 0.5,
                ease: [0.77, 0, 0.175, 1],
              }}
            >
              <div className="desk-sheet-header">
                <Icon size={27} strokeWidth={1.5} />
                <span>0{active + 1} / 05</span>
              </div>
              <strong>{t.stages[active].artifact}</strong>
              <div
                className={"desk-diagram diagram-stage-" + active}
                aria-hidden="true"
              >
                {active === 0 && (
                  <>
                    <span className="diagram-idea">
                      <Lightbulb size={23} />
                    </span>
                    <i />
                    <i />
                    <i />
                  </>
                )}
                {active === 1 && (
                  <>
                    <span className="diagram-route-line" />
                    {[1, 2, 3].map((n) => (
                      <span className="diagram-milestone" key={n}>
                        {n}
                      </span>
                    ))}
                  </>
                )}
                {active === 2 && (
                  <div className="diagram-browser">
                    <span>
                      <i />
                      <i />
                      <i />
                    </span>
                    <strong />
                    <div>
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                )}
                {active === 3 && (
                  <>
                    <span className="diagram-review">
                      <Check size={19} />
                      <Check size={19} />
                    </span>
                    <span className="diagram-feedback">
                      <MessageSquare size={25} />
                    </span>
                  </>
                )}
                {active === 4 && (
                  <>
                    <span className="diagram-parcel">
                      <PackageCheck size={33} />
                    </span>
                    <span className="diagram-next">
                      <ArrowUpRight size={26} />
                    </span>
                  </>
                )}
              </div>
              <div className="desk-sheet-notes">
                {t.stages[active].notes.map((note, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      opacity: 1,
                      transform: calm
                        ? "none"
                        : "translateX(" + (active % 2 ? 3 : 0) + "px)",
                    }}
                    transition={{
                      duration: calm ? 0 : 0.35,
                      delay: calm ? 0 : i * 0.06,
                    }}
                  >
                    <span>
                      {active >= 3 ? <Check size={12} /> : "0" + (i + 1)}
                    </span>
                    {note}
                  </motion.div>
                ))}
              </div>
              <div className="desk-mini-build">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.i
                    key={i}
                    initial={false}
                    animate={{
                      opacity: i <= active ? 1 : 0.15,
                      transform: "scaleY(" + (i <= active ? 1 : 0.5) + ")",
                    }}
                    transition={{ duration: calm ? 0 : 0.45 }}
                  />
                ))}
              </div>
            </motion.div>
            <motion.span
              className="desk-stamp"
              initial={false}
              animate={{
                opacity: active === 4 ? 1 : 0,
                transform: calm
                  ? "none"
                  : active === 4
                    ? "rotate(-12deg) scale(1)"
                    : "rotate(-12deg) scale(.95)",
              }}
              transition={{ duration: calm ? 0 : 0.35 }}
            >
              <PackageCheck size={19} />
              {locale === "es"
                ? "Para seguir avanzando"
                : "Ready for the next step"}
            </motion.span>
            <span className="desk-spark">✳</span>
          </div>
        </aside>
        <div className="journey-chapters">
          {t.stages.map((stage, i) => (
            <article
              id={"journey-" + i}
              className="journey-chapter"
              key={stage.short}
              data-active={i === active}
              data-chapter={i}
            >
              <div className="journey-chapter-kicker">
                <span>0{i + 1}</span>
                <span>{stage.short}</span>
              </div>
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
              <dl className="journey-responsibilities">
                <div>
                  <dt>{t.client}</dt>
                  <dd>{stage.client}</dd>
                </div>
                <div>
                  <dt>{t.team}</dt>
                  <dd>{stage.team}</dd>
                </div>
              </dl>
              <div className="journey-outcome">
                <Check size={18} aria-hidden="true" />
                <div>
                  <strong>{t.outcome}</strong>
                  <p>{stage.outcome}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
