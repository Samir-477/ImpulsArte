"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";

export function SignInForm({
  locale,
  next,
  googleEnabled,
}: {
  locale: Locale;
  next: string;
  googleEnabled: boolean;
}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();
  const t =
    locale === "es"
      ? {
          email: "Tu correo electrónico",
          continue: "Continuar con correo",
          google: "Continuar con Google",
          code: "Código recibido por correo",
          verify: "Verificar código",
          sent: "Enviamos un código a tu correo.",
          setup: "El acceso estará disponible cuando se conecte Supabase.",
          error:
            "No pudimos completar el acceso. Revisá los datos e intentá de nuevo.",
        }
      : {
          email: "Your email address",
          continue: "Continue with email",
          google: "Continue with Google",
          code: "Code from your email",
          verify: "Verify code",
          sent: "We sent a code to your email.",
          setup: "Sign-in will be available once Supabase is connected.",
          error: "We could not sign you in. Check the details and try again.",
        };
  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const result = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (result.error) setError(t.error);
    else setStage("code");
  }
  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const result = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setBusy(false);
    if (result.error) setError(t.error);
    else window.location.assign(next);
  }
  async function google() {
    if (!supabase) return;
    setBusy(true);
    setError("");
    const redirectTo =
      window.location.origin +
      "/auth/callback?next=" +
      encodeURIComponent(next);
    const result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (result.error) {
      setBusy(false);
      setError(t.error);
    }
  }
  return (
    <div className="signin-form">
      {!supabase && <p className="form-notice">{t.setup}</p>}
      {stage === "email" ? (
        <>
          {googleEnabled && (
            <button
              type="button"
              className="google-button"
              onClick={google}
              disabled={!supabase || busy}
            >
              <span className="google-g">G</span>
              {t.google}
            </button>
          )}
          {googleEnabled && (
            <div className="form-divider">
              <span />
              {locale === "es" ? "o" : "or"}
              <span />
            </div>
          )}
          <form onSubmit={sendCode}>
            <label htmlFor="email">{t.email}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@company.com"
              autoComplete="email"
              disabled={!supabase || busy}
            />
            <button
              type="submit"
              className="button button-primary form-submit"
              disabled={!supabase || busy}
            >
              {t.continue}
              <ArrowRight size={17} />
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={verifyCode}>
          <p className="form-help">{t.sent}</p>
          <label htmlFor="code">{t.code}</label>
          <input
            id="code"
            inputMode="numeric"
            pattern="[0-9]{6,8}"
            maxLength={8}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
            autoComplete="one-time-code"
          />
          <button
            type="submit"
            className="button button-primary form-submit"
            disabled={busy}
          >
            {t.verify}
            <ArrowRight size={17} />
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => setStage("email")}
          >
            {locale === "es" ? "Usar otro correo" : "Use another email"}
          </button>
        </form>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
