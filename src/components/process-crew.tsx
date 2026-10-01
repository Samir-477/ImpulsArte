"use client";

import { motion } from "motion/react";
import { useSceneMotion } from "@/components/motion-experience";
import type { Locale } from "@/lib/content";

// Original vector characters: each gesture is its own animatable layer.
export function ProcessCrew({ locale }: { locale: Locale }) {
  const { ref, running, reduced, paused } = useSceneMotion();
  return (
    <div
      ref={ref}
      className="process-crew animated-scene"
      data-running={running}
    >
      <motion.svg
        viewBox="0 0 560 440"
        fill="none"
        aria-hidden="true"
        initial={false}
        whileInView={{ transform: "translateY(0) rotate(0deg)" }}
        style={{ overflow: "visible" }}
        transition={{
          duration: reduced || paused ? 0 : 0.6,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        <ellipse
          cx="282"
          cy="390"
          rx="232"
          ry="19"
          fill="currentColor"
          opacity=".07"
        />
        <ellipse
          cx="280"
          cy="224"
          rx="189"
          ry="169"
          fill="#dce7ff"
          opacity=".7"
        />
        <path
          d="M62 87c21-34 82-48 121-23M403 82c39-27 89-10 105 29M52 312c-21-12-29-36-20-58"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 9"
          opacity=".25"
        />
        <motion.g
          className="crew-board"
          initial={false}
          animate={{
            transform: running
              ? [
                  "translateY(0px) rotate(-1deg)",
                  "translateY(-6px) rotate(1deg)",
                  "translateY(0px) rotate(-1deg)",
                ]
              : "translateY(0px) rotate(-1deg)",
          }}
          transition={{
            duration: running ? 8 : 0,
            repeat: running ? Infinity : 0,
            ease: [0.77, 0, 0.175, 1],
          }}
        >
          <path
            d="M182 122 376 110l15 209-191 12Z"
            fill="var(--surface)"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="m196 146 165-10"
            stroke="currentColor"
            strokeWidth="2"
            opacity=".15"
          />
          <circle cx="200" cy="134" r="3" fill="#3659dc" />
          <circle cx="210" cy="133" r="3" fill="#a7cbb9" />
          <circle cx="220" cy="132" r="3" fill="#eca899" />
          <path
            d="m218 163 91-5"
            stroke="#3659dc"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="m219 180 130-7m-129 18 80-4"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".25"
          />
          <path
            d="m219 217 55-3 3 43-55 3Z"
            fill="#dce7ff"
            stroke="#3659dc"
            strokeWidth="2"
          />
          <path
            d="m294 213 54-3 3 43-54 3Z"
            fill="#d6eedf"
            stroke="#527c68"
            strokeWidth="2"
          />
          <path
            d="m231 231 12 11 20-24m43 13h31m-16-15 1 30"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m225 283 107-6m-106 17 72-3"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".25"
          />
        </motion.g>
        <g className="crew-left">
          <path
            d="m104 300-13 72 23 3 25-65m6-2 11 70 25-2-5-85"
            fill="#203454"
            stroke="#203454"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="m89 371-17 14c-4 4-1 8 4 8h38l1-17m42 0 1 16h42c4-7-6-14-19-17"
            fill="#3659dc"
            stroke="#203454"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M99 212c-12 17-17 55-10 91 26 14 61 17 86-4l-13-92Z"
            fill="#3659dc"
            stroke="#203454"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="m121 202-2 17c11 10 20 11 30 0l-4-25"
            fill="#f2bc9e"
            stroke="#203454"
            strokeWidth="2.5"
          />
          <path
            d="M113 168c-8-35 44-51 50-11l-6 32c-3 21-31 24-39 6Z"
            fill="#f2bc9e"
            stroke="#203454"
            strokeWidth="2.5"
          />
          <path
            d="M111 177c-23-5-24-40-4-51 2-23 38-31 52-9 24 0 34 22 22 37-9-13-20-14-29-16-4 15-17 22-35 21Z"
            fill="#203454"
          />
          <path d="M107 137c-22-5-36 14-30 32 7 16 25 16 34 9" fill="#203454" />
          <g className="crew-eyes">
            <circle cx="139" cy="168" r="2.5" fill="#203454" />
            <circle cx="154" cy="168" r="2.5" fill="#203454" />
          </g>
          <path
            d="m149 175 2 6-5 1m-10 4c5 5 11 5 15 0"
            stroke="#203454"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M96 223c-26 25-17 54 14 49l11-13"
            stroke="#203454"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M96 223c-26 25-17 54 14 49l11-13"
            stroke="#3659dc"
            strokeWidth="17"
            strokeLinecap="round"
          />
          <path
            d="m119 257 6-10 10 9-10 12"
            fill="#f2bc9e"
            stroke="#203454"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <g className="crew-point-arm">
            <path
              d="m158 221 30 17 26-36"
              stroke="#203454"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m158 221 30 17 26-36"
              stroke="#3659dc"
              strokeWidth="17"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m209 207 1-17 7-11c3-3 6 0 4 4l-3 8 11-1c6 5 3 14-6 16Z"
              fill="#f2bc9e"
              stroke="#203454"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <g className="crew-right">
          <path
            d="m403 300-8 78 24 1 19-76m6-1 26 71 23-6-15-75"
            fill="#3659dc"
            stroke="#203454"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="m395 376-18 9c-6 3-5 9 1 9h40l2-15m53-10 3 21h38c5-7-7-13-17-20"
            fill="#203454"
            stroke="#203454"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M405 201c-9 23-22 64-15 96 27 18 62 19 93 4l-20-89Z"
            fill="#b8dfc7"
            stroke="#203454"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="m424 196-3 18c13 10 23 8 31-1l-5-20"
            fill="#d99c7d"
            stroke="#203454"
            strokeWidth="2.5"
          />
          <path
            d="M411 157c-1-38 52-41 51-3l-6 35c-4 22-31 27-40 7Z"
            fill="#d99c7d"
            stroke="#203454"
            strokeWidth="2.5"
          />
          <path
            d="M408 164c-18-22-6-55 17-54 15-12 35-3 37 10 21 11 14 33-1 46l-9-21c-15 6-28-1-29-9l-2 28Z"
            fill="#203454"
          />
          <g className="crew-eyes">
            <circle cx="424" cy="166" r="2.5" fill="#203454" />
            <circle cx="440" cy="166" r="2.5" fill="#203454" />
          </g>
          <path
            d="m430 172-2 7 6 1m-9 10c5 4 12 2 14-3"
            stroke="#203454"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="m463 224 23 36-24 10"
            stroke="#203454"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m463 224 23 36-24 10"
            stroke="#b8dfc7"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m464 262-11 1-5 9 15 8"
            fill="#d99c7d"
            stroke="#203454"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <g className="crew-pencil-arm">
            <path
              d="m411 220-24 24-29-16"
              stroke="#203454"
              strokeWidth="22"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m411 220-24 24-29-16"
              stroke="#b8dfc7"
              strokeWidth="17"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="m362 219-12-1-7 7 13 14 8-9"
              fill="#d99c7d"
              stroke="#203454"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="m350 235-15-43 7-3 16 44-3 9Z"
              fill="#eda386"
              stroke="#203454"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <g className="crew-idea-note">
          <path
            d="m69 42 73 9-9 71-73-9Z"
            fill="#f4d8ca"
            stroke="#203454"
            strokeWidth="2"
          />
          <path
            d="M98 65c-15-2-21 17-9 25l1 8 13 2 3-8c15-5 10-24-8-27Zm-8 38 12 2"
            stroke="#203454"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
        <g className="crew-done-note">
          <path
            d="m406 38 70-8 7 60-70 8Z"
            fill="#b8dfc7"
            stroke="#203454"
            strokeWidth="2"
          />
          <path
            d="m425 63 12 10 21-25"
            stroke="#203454"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g
          className="crew-spark"
          stroke="#3659dc"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M285 43v34m-17-17h34m-29-12 24 24m0-24-24 24" />
        </g>
        <path
          d="M161 82c20-33 67-40 91-17m67 0c23-24 56-24 77-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="3 7"
          strokeLinecap="round"
          opacity=".4"
        />
      </motion.svg>
      <p className="crew-caption">
        <span className="crew-caption-dot" />
        {locale === "es"
          ? "Tu idea + nuestro equipo. Hagamos que avance."
          : "Your idea + our team. Let's move it forward."}
      </p>
    </div>
  );
}
