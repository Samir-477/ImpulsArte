"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";

export function ClaimInvitation({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [bio, setBio] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function claim(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase || !confirmed) return;
    setBusy(true);
    setError("");
    const result = await supabase.rpc("claim_developer_invitation", {
      developer_name: name.trim(),
      city: city.trim(),
      skills: skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      portfolio_url: portfolio.trim(),
      bio: bio.trim(),
    });
    setBusy(false);
    if (result.error)
      setError(
        locale === "es"
          ? "No pudimos enviar el perfil. Revisá los datos y que estés usando el correo invitado."
          : "We could not submit the profile. Check your details and use the invited email.",
      );
    else {
      router.push("/developer");
      router.refresh();
    }
  }
  return (
    <form className="claim-box" onSubmit={claim}>
      <div className="form-row">
        <div>
          <label htmlFor="dev-name">
            {locale === "es" ? "Nombre completo" : "Full name"}
          </label>
          <input
            id="dev-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            required
          />
        </div>
        <div>
          <label htmlFor="dev-city">
            {locale === "es" ? "Ciudad en India" : "City in India"}
          </label>
          <input
            id="dev-city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            minLength={2}
            required
          />
        </div>
      </div>
      <label htmlFor="dev-skills">
        {locale === "es"
          ? "Habilidades, separadas por comas"
          : "Skills, separated by commas"}
      </label>
      <input
        id="dev-skills"
        value={skills}
        onChange={(event) => setSkills(event.target.value)}
        placeholder="React, Node.js, Supabase"
        required
      />
      <label htmlFor="dev-portfolio">
        {locale === "es"
          ? "Portfolio o perfil profesional (opcional)"
          : "Portfolio or professional profile (optional)"}
      </label>
      <input
        id="dev-portfolio"
        type="url"
        pattern="https://.*"
        value={portfolio}
        onChange={(event) => setPortfolio(event.target.value)}
        placeholder="https://"
      />
      <label htmlFor="dev-bio">
        {locale === "es"
          ? "Contanos sobre tu experiencia"
          : "Tell us about your experience"}
      </label>
      <textarea
        id="dev-bio"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        minLength={30}
        maxLength={2000}
        rows={5}
        required
      />
      <label className="claim-confirm">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          required
        />
        {locale === "es"
          ? "Confirmo que estoy ubicado en India y que mi perfil puede ser revisado manualmente."
          : "I confirm I am based in India and understand that my profile will be reviewed manually."}
      </label>
      <button
        className="button button-primary"
        type="submit"
        disabled={!confirmed || busy}
      >
        {locale === "es" ? "Solicitar revisión" : "Request review"}
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </form>
  );
}
