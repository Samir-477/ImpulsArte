import type { Metadata } from "next";
import Link from "@/components/locale-link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { ServiceFinder, ServiceGlyph } from "@/components/service-finder";
import { content, getLocale, serviceKeys, servicePath } from "@/lib/content";
import { notFound } from "next/navigation";
import { getPublicServices } from "@/lib/public-services";
import { ServiceEntrance } from "@/components/landing-motion";
import { ClassicHeroVisual } from "@/components/classic-hero-visual";
import { ServiceRibbon, AnimatedScene } from "@/components/motion-experience";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = getLocale((await params).locale);
  if (!locale) return {};
  return {
    title:
      locale === "es"
        ? "Desarrollo, servicios empresariales y consultoría digital"
        : "Development, business services and digital consultancy",
    description: content[locale].home.intro,
    alternates: {
      canonical: "/",
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const t = content[locale];
  const services = await getPublicServices(locale);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="eyebrow-line" />
              {t.home.eyebrow}
            </p>
            <h1>{t.home.title}</h1>
            <p className="hero-intro">{t.home.intro}</p>
            <div className="hero-actions">
              <Link
                href={"/" + locale + "/start"}
                className="button button-primary"
              >
                {t.nav.start}
                <ArrowUpRight size={19} />
              </Link>
              <Link href={"/" + locale + "/services"} className="text-link">
                {t.home.browse}
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="hero-bottom">
              <span className="mini-rule" />
              {locale === "es"
                ? "Somos la herramienta que mueve tus ideas a la realidad"
                : "We turn your ideas into reality."}
            </div>
          </div>
          <ClassicHeroVisual locale={locale} />
        </div>
        <div className="hero-scroll container">
          <ArrowDown size={16} />
          <span>
            {locale === "es"
              ? "Descubrí lo que hacemos"
              : "Discover what we do"}
          </span>
        </div>
      </section>

      <ServiceRibbon
        locale={locale}
        labels={serviceKeys
          .filter((key) => services[key].published)
          .map((key) => services[key].name)
          .concat(
            locale === "es"
              ? [
                  "Servicios empresariales",
                  "Consultoría digital",
                  "Ideas que avanzan",
                ]
              : ["Business services", "Digital consultancy", "Ideas in motion"],
          )}
      />
      <section className="discovery-section" id="discover">
        <div className="container discovery-grid">
          <div className="discovery-copy">
            <p className="section-overline">
              {locale === "es"
                ? "Explorá sin perderte"
                : "Explore with clarity"}
            </p>
            <h2>{t.home.sectionTitle}</h2>
            <p>{t.home.sectionIntro}</p>
            <Link href={"/" + locale + "/services"} className="underlined-link">
              {t.common.allServices}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <ServiceFinder locale={locale} services={services} />
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="section-overline">
                {locale === "es" ? "Lo que hacemos" : "What we do"}
              </p>
              <h2>
                {locale === "es"
                  ? "Soluciones para cada etapa."
                  : "Solutions for every stage."}
              </h2>
            </div>
            <p>
              {locale === "es"
                ? "Desde una primera presencia online hasta herramientas que hacen crecer tu operación."
                : "From your first online presence to tools that help your operation grow."}
            </p>
          </div>
          <div className="service-grid">
            {serviceKeys
              .filter((key) => services[key].published)
              .map((key, index) => (
                <ServiceEntrance key={key} index={index}>
                  <Link
                    href={servicePath(locale, key)}
                    className={"service-card card-" + key}
                  >
                    <div className="service-card-top">
                      <span className="service-card-index">0{index + 1}</span>
                      <ArrowUpRight size={22} />
                    </div>
                    <AnimatedScene kind={key} className="service-card-glyph">
                      <ServiceGlyph type={key} />
                    </AnimatedScene>
                    <div className="service-card-content">
                      <span>{services[key].eyebrow}</span>
                      <h3>{services[key].name}</h3>
                      <p>{services[key].short}</p>
                      {services[key].price !== null && (
                        <span className="price-line">
                          {locale === "es" ? "Desde" : "From"} ARS{" "}
                          {services[key].price.toLocaleString(
                            locale === "es" ? "es-AR" : "en-US",
                          )}
                        </span>
                      )}
                      <strong>
                        {t.common.explore}
                        <ChevronRight size={17} />
                      </strong>
                    </div>
                  </Link>
                </ServiceEntrance>
              ))}
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="container closing-inner">
          <span className="closing-asterisk">✳</span>
          <div>
            <h2>{t.home.ctaTitle}</h2>
            <p>{t.home.ctaBody}</p>
          </div>
          <Link href={"/" + locale + "/start"} className="button button-light">
            {t.nav.start}
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
    </>
  );
}
