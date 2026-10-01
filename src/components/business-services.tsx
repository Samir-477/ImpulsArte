import Link from "@/components/locale-link";
import { ArrowUpRight, BriefcaseBusiness, Compass } from "lucide-react";
import type { Locale } from "@/lib/content";
import { agencyOfferings } from "@/lib/agency-offerings";
import { BusinessMap } from "@/components/business-map";

export function BusinessServices({
  locale,
  catalog = false,
}: {
  locale: Locale;
  catalog?: boolean;
}) {
  const t = agencyOfferings[locale];
  return (
    <section
      className={"business-services" + (catalog ? " business-catalog" : "")}
      id="business"
    >
      <div className="container">
        <div className="business-heading">
          <div>
            <p className="section-overline">{t.eyebrow}</p>
            <h2>{t.title}</h2>
          </div>
          <div>
            <p>{t.intro}</p>
            <Link href="/about#contact" className="underlined-link">
              {t.action}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <div className="business-offerings">
          <article>
            <BriefcaseBusiness size={25} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <h3>{t.business.title}</h3>
              <p>{t.business.body}</p>
            </div>
          </article>
          <article id="consultancy">
            <Compass size={25} strokeWidth={1.6} aria-hidden="true" />
            <div>
              <h3>{t.consultancy.title}</h3>
              <p>{t.consultancy.body}</p>
            </div>
          </article>
        </div>
      </div>
      {!catalog && (
        <div className="container">
          <BusinessMap locale={locale} />
        </div>
      )}
    </section>
  );
}
