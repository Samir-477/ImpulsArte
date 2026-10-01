"use client";

import { BriefcaseBusiness, Compass, ArrowUpRight, Code2 } from "lucide-react";
import { useSceneMotion } from "@/components/motion-experience";
import { agencyOfferings } from "@/lib/agency-offerings";
import type { Locale } from "@/lib/content";

export function BusinessRail({ locale }: { locale: Locale }) {
  const { ref, running } = useSceneMotion();
  const t = agencyOfferings[locale];
  const cards = [
    {
      title: t.business.title,
      caption: t.direction,
      kind: "business",
      Icon: BriefcaseBusiness,
    },
    {
      title: t.consultancy.title,
      caption: t.connected,
      kind: "consultancy",
      Icon: Compass,
    },
    {
      title: t.technology,
      caption: t.working,
      kind: "technology",
      Icon: Code2,
    },
  ];
  return (
    <div
      ref={ref}
      className="business-rail"
      data-running={running}
      aria-label={t.railLabel}
    >
      <div className="business-rail-track">
        {[0, 1].map((copy) => (
          <div
            className="business-rail-group"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {cards.map(({ title, caption, kind, Icon }) => (
              <div key={kind} className={"offering-slide slide-" + kind}>
                <div className="offering-slide-top">
                  <Icon size={22} strokeWidth={1.6} />
                  <span>{title}</span>
                  <ArrowUpRight size={18} />
                </div>
                <div className="offering-sketch" aria-hidden="true">
                  {kind === "business" && (
                    <>
                      <div className="sketch-route" />
                      <span className="sketch-dot dot-start" />
                      <span className="sketch-dot dot-end" />
                      <div className="sketch-direction">
                        <ArrowUpRight size={43} strokeWidth={1.3} />
                      </div>
                      <i className="sketch-note note-a" />
                      <i className="sketch-note note-b" />
                    </>
                  )}
                  {kind === "consultancy" && (
                    <>
                      <div className="sketch-connections" />
                      <span className="sketch-hub">
                        <Compass size={36} strokeWidth={1.3} />
                      </span>
                      <i className="sketch-node node-a" />
                      <i className="sketch-node node-b" />
                      <i className="sketch-node node-c" />
                    </>
                  )}
                  {kind === "technology" && (
                    <div className="sketch-browser">
                      <span className="sketch-browser-bar">
                        <i />
                        <i />
                        <i />
                      </span>
                      <div className="sketch-browser-body">
                        <span />
                        <span />
                        <div>
                          <i />
                          <i />
                          <i />
                        </div>
                      </div>
                      <span className="sketch-cursor">
                        <ArrowUpRight size={26} />
                      </span>
                    </div>
                  )}
                </div>
                <p>{caption}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
