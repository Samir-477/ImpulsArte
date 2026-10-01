import { notFound } from "next/navigation";
import Link from "@/components/locale-link";
import {
  ArrowDownRight,
  ArrowUpRight,
  MessageCircle,
  MoveUpRight,
} from "lucide-react";
import { content, getLocale } from "@/lib/content";
import { AnimatedScene } from "@/components/motion-experience";
import { StudioWorkspace } from "@/components/studio-workspace";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  return locale
    ? {
        title: locale === "es" ? "Nosotros y contacto" : "About and contact",
        description:
          locale === "es"
            ? "Conocé cómo trabajamos y contanos qué necesitás construir."
            : "See how we work and tell us what you need to build.",
        alternates: { canonical: "/about" },
      }
    : {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const t = content[locale];
  const hasWhatsApp = Boolean(process.env.NEXT_PUBLIC_AGENCY_WHATSAPP);
  const isSpanish = locale === "es";
  const principles = isSpanish
    ? [
        {
          title: "Escuchar",
          body: "Entendemos el problema y lo que necesitás lograr antes de proponer una herramienta.",
        },
        {
          title: "Acordar",
          body: "Definimos el alcance, los tiempos y una propuesta clara para avanzar juntos.",
        },
        {
          title: "Construir",
          body: "Trabajamos por hitos y mantenemos abierta la conversación durante el proyecto.",
        },
      ]
    : [
        {
          title: "Listen",
          body: "We understand the problem and the outcome you need before suggesting a tool.",
        },
        {
          title: "Agree",
          body: "We define the scope, timing, and a clear proposal so we can move together.",
        },
        {
          title: "Build",
          body: "We work through milestones and keep the conversation open throughout the project.",
        },
      ];

  return (
    <>
      <section className="about-studio-opening">
        <div className="container">
          <div className="about-title-row">
            <p className="section-overline">{t.nav.about}</p>
            <span>
              ImpulsArte /{" "}
              {isSpanish ? "ideas en movimiento" : "ideas in motion"}
            </span>
          </div>
          <h1>
            {isSpanish
              ? "Tu idea merece un equipo que la escuche."
              : "Your idea deserves a team that listens."}
          </h1>
          <div className="about-studio-grid">
            <StudioWorkspace locale={locale} />
            <div className="about-studio-intro">
              <blockquote>{t.common.footerLine}</blockquote>
              <p>
                {isSpanish
                  ? "Unimos conversación cercana, servicios empresariales y soluciones digitales. Empezamos por entender lo que querés lograr y encontramos juntos el siguiente paso."
                  : "We bring clear conversation, business services and digital solutions together. We start by understanding what you want to achieve and find the next step together."}
              </p>
              <div className="about-studio-actions">
                <a href="#contact" className="button button-primary">
                  {isSpanish
                    ? "Hablemos de tu proyecto"
                    : "Let's talk about your project"}
                  <ArrowDownRight size={18} />
                </a>
                <Link href="/how-it-works" className="underlined-link">
                  {t.nav.process}
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="studio-principles">
        <div className="container">
          <div className="studio-principles-heading">
            <div>
              <p className="section-overline">
                {isSpanish ? "Nuestra forma de trabajar" : "Our approach"}
              </p>
              <h2>
                {isSpanish
                  ? "Un proceso que podés seguir."
                  : "A process you can follow."}
              </h2>
            </div>
            <p>
              {isSpanish
                ? "Entendemos el objetivo, acordamos el camino y avanzamos con pasos visibles."
                : "We understand the goal, agree on the path, and make progress in visible steps."}
            </p>
          </div>
          <div className="studio-principles-grid">
            {principles.map((principle, index) => (
              <article className="studio-principle" key={principle.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-invitation" id="contact">
        <div className="container contact-invitation-grid">
          <div className="contact-invitation-copy">
            <p className="section-overline">{t.nav.contact}</p>
            <h2>
              {isSpanish
                ? "No hace falta tenerlo todo resuelto."
                : "You don't need it all figured out."}
            </h2>
            <p>
              {isSpanish
                ? "Una idea, una necesidad o una pregunta. Ese es un buen punto de partida para conversar sobre tu negocio o tu próximo proyecto digital."
                : "An idea, a need or a question. That's a good starting point for a conversation about your business or your next digital project."}
            </p>
            <Link href="/start" className="button button-primary">
              {t.nav.start}
              <ArrowUpRight size={19} />
            </Link>
            <div className="contact-next-step">
              <MessageCircle size={20} aria-hidden="true" />
              <p>
                {isSpanish
                  ? "Después, revisamos el pedido y conversamos sobre el alcance y los próximos pasos."
                  : "Next, we review your request and discuss the scope and next steps."}
              </p>
            </div>
            {hasWhatsApp && (
              <p className="contact-continuation">
                {isSpanish
                  ? "También podés continuar la conversación por WhatsApp."
                  : "You can also continue the conversation on WhatsApp."}
              </p>
            )}
          </div>
          <AnimatedScene kind="invitation" className="contact-letter-scene">
            <span className="contact-envelope-back" aria-hidden="true" />
            <div className="contact-letter">
              <div className="contact-letter-head">
                <span>ImpulsArte</span>
                <MoveUpRight size={22} aria-hidden="true" />
              </div>
              <h3>
                {isSpanish ? "Para empezar, contanos…" : "To begin, tell us…"}
              </h3>
              <ol>
                <li>
                  <span>
                    {isSpanish
                      ? "¿Qué querés lograr?"
                      : "What do you want to achieve?"}
                  </span>
                  <p>
                    {isSpanish
                      ? "El objetivo o la idea que tenés en mente."
                      : "The goal or idea you have in mind."}
                  </p>
                </li>
                <li>
                  <span>
                    {isSpanish ? "¿Dónde estás hoy?" : "Where are you today?"}
                  </span>
                  <p>
                    {isSpanish
                      ? "Un poco de contexto sobre tu negocio o proyecto."
                      : "Some context about your business or project."}
                  </p>
                </li>
                <li>
                  <span>
                    {isSpanish
                      ? "¿Qué tiempos tenés?"
                      : "What timing do you have in mind?"}
                  </span>
                  <p>
                    {isSpanish
                      ? "Tus prioridades y cualquier fecha que debamos considerar."
                      : "Your priorities and any dates we should consider."}
                  </p>
                </li>
              </ol>
              <div className="contact-letter-signoff">
                <span>
                  {isSpanish
                    ? "Lo demás lo conversamos juntos."
                    : "We'll work through the rest together."}
                </span>
                <span aria-hidden="true">✳</span>
              </div>
            </div>
            <span className="contact-letter-pencil" aria-hidden="true" />
          </AnimatedScene>
        </div>
      </section>
    </>
  );
}
