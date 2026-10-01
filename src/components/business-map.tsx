"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BriefcaseBusiness, Compass, Code2 } from "lucide-react";
import {
  useSceneMotion,
  useMotionPreference,
} from "@/components/motion-experience";
import { agencyOfferings } from "@/lib/agency-offerings";
import type { Locale } from "@/lib/content";

const nodes = [
  {
    x: 100,
    y: 80,
    path: "M136 101 L180 126",
    start: "translate(136px, 101px)",
    end: "translate(180px, 126px)",
  },
  {
    x: 500,
    y: 80,
    path: "M464 101 L420 126",
    start: "translate(464px, 101px)",
    end: "translate(420px, 126px)",
  },
  {
    x: 300,
    y: 310,
    path: "M300 268 L300 250",
    start: "translate(300px, 268px)",
    end: "translate(300px, 250px)",
  },
];

export function BusinessMap({ locale }: { locale: Locale }) {
  const t = agencyOfferings[locale];
  const [selected, setSelected] = useState(0);
  const calm = useMotionPreference();
  const { ref, running } = useSceneMotion();
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setSelected((value) => (value + 1) % 3),
      4500,
    );
    return () => window.clearInterval(timer);
  }, [running]);
  const options = [
    { name: t.business.title, caption: t.direction, Icon: BriefcaseBusiness },
    { name: t.consultancy.title, caption: t.connected, Icon: Compass },
    { name: t.technology, caption: t.working, Icon: Code2 },
  ];
  const Icon = options[selected].Icon;
  const words = options[selected].caption.split(" ");
  const lines: string[] = [""];
  for (const word of words) {
    const last = lines.length - 1;
    if ((lines[last] + " " + word).trim().length > 24) lines.push(word);
    else lines[last] = (lines[last] + " " + word).trim();
  }
  return (
    <div className="business-map" ref={ref}>
      <div className="business-map-drawing">
        <svg viewBox="0 0 600 370" fill="none" aria-hidden="true">
          <path
            d="M100 80 Q300 -10 500 80 Q560 260 300 310 Q40 260 100 80"
            stroke="var(--line)"
            strokeDasharray="4 9"
          />
          {nodes.map((node, i) => {
            const NodeIcon = options[i].Icon;
            return (
              <g key={node.path}>
                <path d={node.path} stroke="var(--line)" strokeWidth="2" />
                <motion.path
                  d={node.path}
                  stroke="var(--blue)"
                  strokeWidth="3"
                  initial={false}
                  animate={{ opacity: selected === i ? 1 : 0 }}
                  transition={{ duration: calm ? 0 : 0.2 }}
                />
                {selected === i && (
                  <motion.g
                    key={i}
                    initial={false}
                    animate={
                      running
                        ? {
                            transform: [
                              node.start,
                              node.start,
                              node.end,
                              node.end,
                            ],
                            opacity: [0, 1, 1, 0],
                          }
                        : { transform: node.start, opacity: 0 }
                    }
                    transition={
                      running
                        ? {
                            duration: 2.4,
                            times: [0, 0.15, 0.8, 1],
                            ease: "linear",
                            repeat: Infinity,
                            repeatDelay: 0.4,
                          }
                        : { duration: 0 }
                    }
                  >
                    <circle r="5" fill="var(--blue)" />
                  </motion.g>
                )}
                {selected === i && (
                  <g transform={"translate(" + node.x + " " + node.y + ")"}>
                    <motion.circle
                      r="46"
                      stroke="var(--blue)"
                      strokeWidth="1"
                      initial={false}
                      animate={
                        running
                          ? {
                              transform: [
                                "scale(1)",
                                "scale(1.16)",
                                "scale(1)",
                              ],
                              opacity: [0.3, 0.1, 0.3],
                            }
                          : { transform: "scale(1)", opacity: 0.3 }
                      }
                      transition={
                        running
                          ? {
                              duration: 2.4,
                              ease: [0.77, 0, 0.175, 1],
                              repeat: Infinity,
                            }
                          : { duration: 0 }
                      }
                    />
                  </g>
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="42"
                  fill={["var(--pale)", "var(--mint)", "var(--sand)"][i]}
                  stroke={selected === i ? "var(--blue)" : "var(--line)"}
                  strokeWidth="1.5"
                />
                <NodeIcon
                  x={node.x - 15}
                  y={node.y - 15}
                  width={30}
                  height={30}
                  stroke={selected === i ? "var(--blue)" : "var(--ink)"}
                  strokeWidth={1.5}
                />
              </g>
            );
          })}
          <rect
            className="business-map-paper"
            x="180"
            y="110"
            width="240"
            height="140"
            rx="12"
            fill="var(--surface)"
            stroke="var(--line)"
          />
          <motion.g
            key={selected}
            initial={calm ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: calm ? 0 : 0.2 }}
          >
            <Icon
              x={285}
              y={130}
              width={30}
              height={30}
              stroke="var(--blue)"
              strokeWidth={1.5}
            />
            <text
              x="300"
              y="183"
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="12"
            >
              ImpulsArte
            </text>
            <text
              x="300"
              y={lines.length > 1 ? 208 : 216}
              textAnchor="middle"
              fill="var(--ink)"
              fontSize="16"
              fontWeight="600"
            >
              {lines.map((line, i) => (
                <tspan key={line} x="300" dy={i === 0 ? 0 : 21}>
                  {line}
                </tspan>
              ))}
            </text>
          </motion.g>
        </svg>
      </div>
      <p className="sr-only">
        {options[selected].name}: {options[selected].caption}
      </p>
      <div
        className="business-map-options"
        aria-label={locale === "es" ? "Explorá las áreas" : "Explore our areas"}
      >
        {options.map(({ name, Icon }, i) => (
          <button
            key={name}
            type="button"
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <Icon size={18} />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
