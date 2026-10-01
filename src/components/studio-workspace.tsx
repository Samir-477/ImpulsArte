"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedScene } from "@/components/motion-experience";
import { useMotionPreference } from "@/components/motion-experience";
import type { Locale } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export function StudioWorkspace({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const calm = useMotionPreference();
  useEffect(() => {
    if (!root.current || calm) return;
    const path = root.current.querySelector<SVGPathElement>(
      ".workspace-idea-path",
    );
    if (!path) return;
    const length = path.getTotalLength();
    const context = gsap.context(() => {
      gsap.fromTo(
        path,
        {
          strokeDasharray: length,
          strokeDashoffset: length,
        },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 72%",
            once: true,
          },
        },
      );
    }, root.current);
    return () => context.revert();
  }, [calm]);
  return (
    <div ref={root}>
      <AnimatedScene kind="workspace" className="studio-workspace">
        <svg viewBox="0 0 760 430" fill="none" aria-hidden="true">
          <ellipse cx="383" cy="229" rx="322" ry="161" fill="#dce7ff" />
          <path
            className="workspace-idea-path"
            d="M166 102C199 78 213 124 254 116S317 73 358 90 405 145 453 126 494 92 524 104"
            stroke="#3659dc"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M75 367h610"
            stroke="#203454"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g className="workspace-browser">
            <path
              d="M226 90h346v225H226z"
              fill="#fbfcfa"
              stroke="#203454"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M226 121h346" stroke="#203454" strokeWidth="2" />
            <circle cx="242" cy="106" r="3" fill="#3659dc" />
            <circle cx="253" cy="106" r="3" fill="#b8dfc7" />
            <circle cx="264" cy="106" r="3" fill="#eda386" />
            <rect
              x="247"
              y="140"
              width="302"
              height="83"
              rx="3"
              fill="#3659dc"
            />
            <path
              d="M267 163h144m-144 15h210m-210 15h174"
              stroke="#eff4ff"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect
              x="247"
              y="240"
              width="88"
              height="49"
              rx="3"
              fill="#dce7ff"
            />
            <rect
              x="352"
              y="240"
              width="88"
              height="49"
              rx="3"
              fill="#d6eedf"
            />
            <rect
              x="457"
              y="240"
              width="91"
              height="49"
              rx="3"
              fill="#f4d8ca"
            />
            <path
              d="m290 315-20 32h255l-21-32"
              fill="#dce7ff"
              stroke="#203454"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
          <g className="workspace-note">
            <path
              d="m98 115 105-12 15 135-107 12Z"
              fill="#f4d8ca"
              stroke="#203454"
              strokeWidth="2"
            />
            <path
              d="m119 139 59-7m-57 23 67-7m-65 23 52-6"
              stroke="#203454"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="m132 204 12 10 21-27"
              stroke="#3659dc"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <g className="workspace-envelope">
            <path
              d="m539 255 111-13 10 82-113 13Z"
              fill="#b8dfc7"
              stroke="#203454"
              strokeWidth="2.5"
            />
            <path
              d="m540 256 62 41 48-54m-102 91 36-50m76 39-47-42"
              stroke="#203454"
              strokeWidth="2"
            />
          </g>
          <g className="workspace-hand">
            <path
              d="m77 350 34-56 27-15 45-4c14 0 15 13 3 18l-23 4 37 1c14 2 15 15 0 18l-43 5-12 23-7 24"
              fill="#f2bc9e"
              stroke="#203454"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m49 354 41-18 52 31-20 31-61-2Z"
              fill="#3659dc"
              stroke="#203454"
              strokeWidth="2.5"
            />
          </g>
          <g className="workspace-pencil">
            <path
              d="m598 92 13-5 47 111-8 22-16-12Z"
              fill="#eda386"
              stroke="#203454"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="m634 209 16 11 8-22" fill="#203454" />
          </g>
          <g className="workspace-chat">
            <path
              d="M490 45h121c11 0 16 7 16 17v34c0 10-5 15-16 15h-67l-19 16 1-16h-36c-9 0-14-6-14-15V62c0-10 5-17 14-17Z"
              fill="#fbfcfa"
              stroke="#203454"
              strokeWidth="2"
            />
            <circle cx="510" cy="79" r="4" fill="#3659dc" />
            <circle cx="548" cy="79" r="4" fill="#3659dc" />
            <circle cx="585" cy="79" r="4" fill="#3659dc" />
          </g>
          <g
            className="workspace-spark"
            stroke="#3659dc"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M175 51v32m-16-16h32m-27-11 22 22m0-22-22 22" />
          </g>
        </svg>
        <div className="workspace-label">
          <span>
            ImpulsArte / {locale === "es" ? "el estudio" : "the studio"}
          </span>
          <span>
            {locale === "es"
              ? "Una idea. Muchas posibilidades."
              : "One idea. Many possibilities."}
          </span>
        </div>
      </AnimatedScene>
    </div>
  );
}
