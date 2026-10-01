import { notFound } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { content, getLocale } from "@/lib/content";
import { DetailedProcessStory } from "@/components/detailed-process-story";
import { BusinessServices } from "@/components/business-services";
import { ProcessCrew } from "@/components/process-crew";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  return locale
    ? {
        title: locale === "es" ? "Cómo trabajamos" : "How we work",
        description: content[locale].home.processIntro,
        alternates: {
          canonical: "/how-it-works",
        },
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
  return (
    <>
      <section className="process-page-hero crew-hero">
        <div className="container crew-hero-grid">
          <div className="crew-hero-copy">
            <p className="section-overline">{t.nav.process}</p>
            <h1>
              {locale === "es"
                ? "Tu idea avanza cuando trabajamos juntos."
                : "Your idea moves forward when we work together."}
            </h1>
            <p className="crew-hero-intro">{t.home.processIntro}</p>
            <a href="#the-process" className="underlined-link">
              {locale === "es" ? "Conocé el proceso" : "Explore the process"}
              <ArrowDownRight size={18} />
            </a>
          </div>
          <ProcessCrew locale={locale} />
        </div>
      </section>
      <section className="process-page-body" id="the-process">
        <div className="container">
          <DetailedProcessStory locale={locale} />
        </div>
      </section>
      <BusinessServices locale={locale} />
      <section className="simple-cta">
        <div className="container simple-cta-inner">
          <div>
            <h2>{t.home.ctaTitle}</h2>
            <p>{t.home.ctaBody}</p>
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
