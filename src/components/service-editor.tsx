"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import {
  content,
  serviceKeys,
  type Locale,
  type ServiceKey,
} from "@/lib/content";

type Localized = {
  name: string;
  eyebrow: string;
  summary: string;
  description: string;
  features: string[];
};
type ServiceDraft = {
  price: string;
  published: boolean;
  es: Localized;
  en: Localized;
};
export function ServiceEditor({
  locale,
  initial,
}: {
  locale: Locale;
  initial: Record<ServiceKey, ServiceDraft>;
}) {
  const [selected, setSelected] = useState<ServiceKey>("websites");
  const [draft, setDraft] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const current = draft[selected];
  function updateService(patch: Partial<ServiceDraft>) {
    setDraft({ ...draft, [selected]: { ...current, ...patch } });
  }
  function updateLocale(lang: Locale, patch: Partial<Localized>) {
    updateService({ [lang]: { ...current[lang], ...patch } });
  }
  async function save() {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    const service = await supabase
      .from("services")
      .update({
        starting_price_ars: current.price.trim() ? Number(current.price) : null,
        published: current.published,
        updated_at: new Date().toISOString(),
      })
      .eq("key", selected);
    if (service.error) {
      setBusy(false);
      setMessage(service.error.message);
      return;
    }
    const rows = (["es", "en"] as const).map((lang) => ({
      service_key: selected,
      locale: lang,
      name: current[lang].name.trim(),
      eyebrow: current[lang].eyebrow.trim(),
      summary: current[lang].summary.trim(),
      description: current[lang].description.trim(),
      features: current[lang].features.filter(Boolean),
    }));
    const result = await supabase
      .from("service_localizations")
      .upsert(rows, { onConflict: "service_key,locale" });
    setBusy(false);
    setMessage(
      result.error
        ? result.error.message
        : locale === "es"
          ? "Servicio guardado."
          : "Service saved.",
    );
    if (!result.error) router.refresh();
  }
  return (
    <div className="editor-layout">
      <nav className="editor-tabs" aria-label="Services">
        {serviceKeys.map((key) => (
          <button
            className={selected === key ? "active" : ""}
            onClick={() => {
              setSelected(key);
              setMessage("");
            }}
            key={key}
          >
            {content[locale].services[key].name}
          </button>
        ))}
      </nav>
      <div className="portal-card editor-form">
        <div className="editor-form-top">
          <h2>{content[locale].services[selected].name}</h2>
          <label className="switch-label">
            <input
              type="checkbox"
              checked={current.published}
              onChange={(event) =>
                updateService({ published: event.target.checked })
              }
            />
            {locale === "es" ? "Publicado" : "Published"}
          </label>
        </div>
        <label htmlFor="starting-price">
          {locale === "es" ? "Precio inicial en ARS" : "Starting price in ARS"}
        </label>
        <input
          id="starting-price"
          type="number"
          min="0"
          step="0.01"
          value={current.price}
          onChange={(event) => updateService({ price: event.target.value })}
          placeholder={
            locale === "es"
              ? "Dejar vacío hasta confirmar el precio"
              : "Leave blank until the price is confirmed"
          }
        />
        {(["es", "en"] as const).map((lang) => (
          <fieldset key={lang}>
            <legend>{lang === "es" ? "Español" : "English"}</legend>
            <label htmlFor={lang + "-name"}>
              {lang === "es" ? "Nombre" : "Name"}
            </label>
            <input
              id={lang + "-name"}
              value={current[lang].name}
              onChange={(event) =>
                updateLocale(lang, { name: event.target.value })
              }
            />
            <label htmlFor={lang + "-eyebrow"}>
              {lang === "es" ? "Categoría breve" : "Short category"}
            </label>
            <input
              id={lang + "-eyebrow"}
              value={current[lang].eyebrow}
              onChange={(event) =>
                updateLocale(lang, { eyebrow: event.target.value })
              }
            />
            <label htmlFor={lang + "-summary"}>
              {lang === "es" ? "Resumen" : "Summary"}
            </label>
            <textarea
              id={lang + "-summary"}
              rows={2}
              value={current[lang].summary}
              onChange={(event) =>
                updateLocale(lang, { summary: event.target.value })
              }
            />
            <label htmlFor={lang + "-description"}>
              {lang === "es" ? "Descripción" : "Description"}
            </label>
            <textarea
              id={lang + "-description"}
              rows={3}
              value={current[lang].description}
              onChange={(event) =>
                updateLocale(lang, { description: event.target.value })
              }
            />
            <label htmlFor={lang + "-features"}>
              {lang === "es"
                ? "Características, una por línea"
                : "Features, one per line"}
            </label>
            <textarea
              id={lang + "-features"}
              rows={5}
              value={current[lang].features.join("\n")}
              onChange={(event) =>
                updateLocale(lang, { features: event.target.value.split("\n") })
              }
            />
          </fieldset>
        ))}
        <div className="editor-bottom">
          <button
            className="button button-primary"
            disabled={
              busy ||
              Number(current.price) < 0 ||
              !current.es.name.trim() ||
              !current.en.name.trim()
            }
            onClick={save}
          >
            {busy
              ? locale === "es"
                ? "Guardando..."
                : "Saving..."
              : locale === "es"
                ? "Guardar servicio"
                : "Save service"}
          </button>
          {message && <p role="status">{message}</p>}
        </div>
      </div>
    </div>
  );
}
