"use client";

import Link from "@/components/locale-link";
import { ArrowUpRight, Search, BriefcaseBusiness, Compass } from "lucide-react";
import { useState } from "react";
import { content, serviceKeys, servicePath, type Locale } from "@/lib/content";
import { agencyOfferings } from "@/lib/agency-offerings";
import type { DisplayServices } from "@/lib/public-services";

export function ServiceFinder({
  locale,
  compact = false,
  services,
}: {
  locale: Locale;
  compact?: boolean;
  services?: DisplayServices;
}) {
  const [query, setQuery] = useState("");
  const t = content[locale];
  const normalized = query.toLocaleLowerCase(locale).trim();
  const listing = services || t.services;
  const results = serviceKeys.filter((key) => {
    const service = listing[key];
    if ("published" in service && !service.published) return false;
    return (
      !normalized ||
      (
        service.name +
        " " +
        service.short +
        " " +
        service.query +
        " " +
        service.items.join(" ")
      )
        .toLocaleLowerCase(locale)
        .includes(normalized)
    );
  });
  const advisory = agencyOfferings[locale];
  const advisoryResults = [
    {
      key: "business",
      title: advisory.business.title,
      body: advisory.business.body,
      query: "business negocio empresa empresarial servicios",
      Icon: BriefcaseBusiness,
    },
    {
      key: "consultancy",
      title: advisory.consultancy.title,
      body: advisory.consultancy.body,
      query:
        "consultancy consulting consultoria consultoría digital estrategia strategy",
      Icon: Compass,
    },
  ].filter(
    (item) =>
      !normalized ||
      (item.title + " " + item.body + " " + item.query)
        .toLocaleLowerCase(locale)
        .includes(normalized),
  );
  return (
    <div className={compact ? "finder finder-compact" : "finder"}>
      <label htmlFor={compact ? "service-search-page" : "service-search"}>
        {t.home.searchLabel}
      </label>
      <div className="search-field">
        <Search size={21} aria-hidden="true" />
        <input
          id={compact ? "service-search-page" : "service-search"}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.home.searchPlaceholder}
          autoComplete="off"
        />
        <span className="search-shortcut" aria-hidden="true">
          ↵
        </span>
      </div>
      <div className="finder-results" aria-live="polite">
        {results.length || advisoryResults.length ? (
          <>
            {results.map((key) => (
              <Link href={servicePath(locale, key)} key={key}>
                <span className={"result-icon result-icon-" + key}>
                  <ServiceGlyph type={key} />
                </span>
                <span>
                  <strong>{listing[key].name}</strong>
                  <small>{listing[key].eyebrow}</small>
                </span>
                <ArrowUpRight size={17} className="result-arrow" />
              </Link>
            ))}
            {advisoryResults.map(({ key, title, Icon }) => (
              <Link href={"/services#" + key} key={key}>
                <span className="result-icon result-icon-advisory">
                  <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>
                    {locale === "es"
                      ? "Conversemos sobre el alcance"
                      : "Let’s discuss the scope"}
                  </small>
                </span>
                <ArrowUpRight size={17} className="result-arrow" />
              </Link>
            ))}
          </>
        ) : (
          <p className="no-results">{t.home.noResults}</p>
        )}
      </div>
    </div>
  );
}

export function ServiceGlyph({
  type,
}: {
  type: "websites" | "web-apps" | "maintenance";
}) {
  return type === "websites" ? (
    <span className="glyph-web">
      <i />
      <i />
      <i />
    </span>
  ) : type === "web-apps" ? (
    <span className="glyph-app">
      <i />
      <i />
      <i />
      <i />
    </span>
  ) : (
    <span className="glyph-maintenance">
      <i />
      <i />
    </span>
  );
}
