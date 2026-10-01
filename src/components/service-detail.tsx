import Link from "@/components/locale-link";
import { ArrowLeft, ArrowUpRight, Check, Plus } from "lucide-react";
import { ServiceGlyph } from "@/components/service-finder";
import { AnimatedScene } from "@/components/motion-experience";
import { ScrollFloat } from "@/components/marketing-motion";
import {
  content,
  serviceKeys,
  servicePath,
  type Locale,
  type ServiceKey,
} from "@/lib/content";
import { getPublicServices } from "@/lib/public-services";
import { notFound } from "next/navigation";

function ServiceArtwork({
  service,
  locale,
}: {
  service: ServiceKey;
  locale: Locale;
}) {
  if (service === "websites")
    return (
      <div className="website-scene" aria-hidden="true">
        <div className="website-window">
          <div className="website-window-top">
            <span />
            <span />
            <span />
            <i />
          </div>
          <div className="website-window-body">
            <span className="website-window-kicker">ImpulsArte / web</span>
            <strong>
              {locale === "es"
                ? "Una presencia que habla por vos."
                : "A presence that speaks for you."}
            </strong>
            <span className="website-window-button" />
            <div className="website-window-blocks">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <span className="website-scene-orbit" />
      </div>
    );
  if (service === "web-apps")
    return (
      <div className="app-scene" aria-hidden="true">
        <div className="app-node app-node-top">
          {locale === "es" ? "Tu equipo" : "Your team"}
        </div>
        <div className="app-node app-node-center">
          <ServiceGlyph type="web-apps" />
        </div>
        <div className="app-node app-node-left">
          {locale === "es" ? "Procesos" : "Workflows"}
        </div>
        <div className="app-node app-node-right">
          {locale === "es" ? "Datos" : "Data"}
        </div>
        <span className="app-connector app-connector-one" />
        <span className="app-connector app-connector-two" />
      </div>
    );
  return (
    <div className="maintenance-scene" aria-hidden="true">
      <span className="maintenance-ring ring-one" />
      <span className="maintenance-ring ring-two" />
      <span className="maintenance-ring ring-three" />
      <span className="maintenance-core">
        <ServiceGlyph type="maintenance" />
      </span>
      <span className="maintenance-spark spark-one">
        <Plus size={19} />
      </span>
      <span className="maintenance-spark spark-two">
        <Plus size={15} />
      </span>
    </div>
  );
}

export async function ServiceDetail({
  locale,
  service,
}: {
  locale: Locale;
  service: ServiceKey;
}) {
  const t = content[locale];
  const services = await getPublicServices(locale);
  const item = services[service];
  if (!item.published) notFound();
  const other = serviceKeys.filter(
    (key) => key !== service && services[key].published,
  );
  return (
    <>
      <section className={"service-hero service-hero-" + service}>
        <div className="container">
          <Link href={"/" + locale + "/services"} className="back-link">
            <ArrowLeft size={16} />
            {t.common.allServices}
          </Link>
          <div className="service-hero-grid">
            <div className="service-hero-copy">
              <p className="section-overline">{item.eyebrow}</p>
              <h1>
                {item.name}
                <span className="heading-dot">.</span>
              </h1>
              <p>{item.detail}</p>
              {item.price !== null && (
                <p className="detail-price">
                  {locale === "es" ? "Desde" : "From"} ARS{" "}
                  {item.price.toLocaleString(
                    locale === "es" ? "es-AR" : "en-US",
                  )}
                </p>
              )}
              <Link
                href={"/" + locale + "/start?service=" + service}
                className="button button-primary"
              >
                {t.nav.start}
                <ArrowUpRight size={18} />
              </Link>
            </div>
            <ScrollFloat className="service-art-motion" distance={22}>
              <AnimatedScene kind={service}>
                <ServiceArtwork service={service} locale={locale} />
              </AnimatedScene>
            </ScrollFloat>
          </div>
        </div>
      </section>

      {service === "websites" && (
        <section className="website-offerings">
          <div className="container website-offerings-grid">
            <div>
              <p className="section-overline">
                {locale === "es"
                  ? "Lo que podemos crear"
                  : "What we can create"}
              </p>
              <h2>
                {locale === "es"
                  ? "Un sitio hecho para tu siguiente paso."
                  : "A site built for your next step."}
              </h2>
              <p>{item.short}</p>
            </div>
            <div className="website-offerings-list">
              {item.items.map((feature) => (
                <div key={feature}>
                  <Check size={18} />
                  <h3>{feature}</h3>
                  <ArrowUpRight size={18} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {service === "web-apps" && (
        <section className="app-capabilities">
          <div className="container">
            <div className="app-capabilities-heading">
              <p className="section-overline">
                {locale === "es"
                  ? "Pensado para tu forma de trabajar"
                  : "Made for the way you work"}
              </p>
              <h2>
                {locale === "es"
                  ? "Las piezas se conectan. El trabajo avanza."
                  : "Connect the pieces. Move work forward."}
              </h2>
              <p>{item.short}</p>
            </div>
            <div className="app-capabilities-grid">
              {item.items.map((feature, index) => (
                <div key={feature} className="app-capability">
                  <span className="app-capability-mark" aria-hidden="true">
                    {index % 2 ? "↗" : "+"}
                  </span>
                  <h3>{feature}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {service === "maintenance" && (
        <section className="maintenance-scope">
          <div className="container maintenance-scope-grid">
            <div>
              <p className="section-overline">
                {locale === "es"
                  ? "Soporte con continuidad"
                  : "Support that stays with you"}
              </p>
              <h2>
                {locale === "es"
                  ? "Lo que ya construiste merece seguir mejorando."
                  : "What you've built deserves to keep improving."}
              </h2>
              <p>{item.short}</p>
            </div>
            <div className="maintenance-scope-list">
              {item.items.map((feature) => (
                <div key={feature}>
                  <span aria-hidden="true" />
                  <h3>{feature}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {other.length > 0 && (
        <section className="detail-next">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-overline">
                  {locale === "es" ? "Seguí explorando" : "Keep exploring"}
                </p>
                <h2>
                  {locale === "es"
                    ? "También podemos ayudarte con"
                    : "We can also help with"}
                </h2>
              </div>
            </div>
            <div className="other-services">
              {other.map((key) => (
                <Link key={key} href={servicePath(locale, key)}>
                  <span>{services[key].eyebrow}</span>
                  <strong>{services[key].name}</strong>
                  <ArrowUpRight size={20} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
