import Link from "@/components/locale-link";
import { ArrowUpRight } from "lucide-react";
import { content, serviceKeys, type Locale } from "@/lib/content";
import { agencyOfferings } from "@/lib/agency-offerings";
import { AnimatedScene } from "@/components/motion-experience";
import { getPublicServices } from "@/lib/public-services";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = content[locale];
  const services = await getPublicServices(locale);
  const visibleServices = serviceKeys.filter((key) => services[key].published);
  return (
    <footer className="site-footer">
      <div className="container footer-opening">
        <div>
          <p>
            {locale === "es"
              ? "Hagamos el próximo paso juntos."
              : "Let's take the next step together."}
          </p>
          <h2>
            {locale === "es"
              ? "Dale impulso a tu idea."
              : "Give your idea momentum."}
          </h2>
        </div>
        <Link href="/start" className="footer-invitation">
          <span>{t.nav.start}</span>
          <ArrowUpRight size={30} strokeWidth={1.5} />
        </Link>
        <AnimatedScene kind="footer" className="footer-sketch">
          <span aria-hidden="true">✳</span>
        </AnimatedScene>
      </div>
      <div className="container footer-main">
        <div className="footer-intro">
          <Link href="/" className="footer-brand">
            ImpulsArte<span>.</span>
          </Link>
          <p>{t.common.footerLine}</p>
        </div>
        <nav className="footer-links" aria-label={t.nav.services}>
          <h2>
            <Link href="/services">{t.nav.services}</Link>
          </h2>
          {visibleServices.map((key) => (
            <Link key={key} href={"/services/" + key}>
              {services[key].name}
            </Link>
          ))}
          <Link href="/services#business">
            {agencyOfferings[locale].business.title}
          </Link>
          <Link href="/services#consultancy">
            {agencyOfferings[locale].consultancy.title}
          </Link>
        </nav>
        <nav
          className="footer-links"
          aria-label={locale === "es" ? "Estudio" : "Studio"}
        >
          <h2>{locale === "es" ? "Estudio" : "Studio"}</h2>
          <Link href="/how-it-works">{t.nav.process}</Link>
          <Link href="/about">{t.nav.about}</Link>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} ImpulsArte. {t.common.rights}
        </span>
        <div className="footer-legal">
          <Link href="/legal/terms">
            {locale === "es" ? "Términos" : "Terms"}
          </Link>
          <Link href="/legal/privacy">
            {locale === "es" ? "Privacidad" : "Privacy"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
