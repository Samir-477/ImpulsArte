import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowUpRight } from "lucide-react";
import { ServiceFinder, ServiceGlyph } from "@/components/service-finder";
import { content, getLocale, serviceKeys, servicePath } from "@/lib/content";
import { getPublicServices } from "@/lib/public-services";
import { AnimatedScene, CatalogEntrance } from "@/components/motion-experience";
import { BusinessServices } from "@/components/business-services";
import { ServiceShowcase } from "@/components/service-showcase";
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
        ? "Servicios y consultoría digital"
        : "Services and digital consultancy",
    description: content[locale].home.sectionIntro,
    alternates: {
      canonical: "/services",
    },
  };
}
export default async function ServicesPage({
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
      <section className="subhero">
        <div className="container services-hero-grid">
          <div>
            <p className="section-overline">
              {locale === "es"
                ? "Explorá nuestros servicios"
                : "Explore our services"}
            </p>
            <h1>
              {locale === "es"
                ? "¿Qué querés construir?"
                : "What do you want to build?"}
            </h1>
            <p>{t.home.sectionIntro}</p>
          </div>
          <ServiceFinder locale={locale} compact services={services} />
        </div>
      </section>
      <section className="catalog-section">
        <div className="container catalog-list">
          {serviceKeys
            .filter((key) => services[key].published)
            .map((key, index) => (
              <CatalogEntrance key={key} index={index}>
                <Link
                  href={servicePath(locale, key)}
                  className={"catalog-row catalog-" + key}
                  key={key}
                >
                  <AnimatedScene kind={key} className="catalog-art">
                    <span className="catalog-art-orbit" />
                    <ServiceGlyph type={key} />
                  </AnimatedScene>
                  <div className="catalog-copy">
                    <span className="catalog-eyebrow">
                      {services[key].eyebrow}
                    </span>
                    <h2>{services[key].name}</h2>
                    <p>{services[key].short}</p>
                    <div className="catalog-features">
                      {services[key].items.slice(0, 3).map((feature) => (
                        <span key={feature}>{feature}</span>
                      ))}
                    </div>
                    {services[key].price !== null && (
                      <span className="catalog-price">
                        {locale === "es" ? "Desde" : "From"} ARS{" "}
                        {services[key].price.toLocaleString(
                          locale === "es" ? "es-AR" : "en-US",
                        )}
                      </span>
                    )}
                  </div>
                  <span className="catalog-arrow" aria-hidden="true">
                    <ArrowUpRight size={24} />
                  </span>
                </Link>
              </CatalogEntrance>
            ))}
        </div>
      </section>
      <ServiceShowcase locale={locale} />
      <BusinessServices locale={locale} catalog />
      <section className="simple-cta">
        <div className="container simple-cta-inner">
          <div>
            <h2>{t.common.questions}</h2>
            <p>{t.common.answer}</p>
          </div>
          <Link
            href={"/" + locale + "/start"}
            className="button button-primary"
          >
            {t.nav.start}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
