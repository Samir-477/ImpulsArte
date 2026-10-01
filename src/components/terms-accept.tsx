"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";

export function TermsAccept({
  locale,
  version,
  next,
}: {
  locale: Locale;
  version: number;
  next: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function accept() {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/signin");
      return;
    }
    const result = await supabase
      .from("legal_acceptances")
      .insert({ user_id: user.id, kind: "terms", version });
    if (result.error && result.error.code !== "23505") {
      setError(
        locale === "es"
          ? "No pudimos guardar tu aceptación. Intentá de nuevo."
          : "We could not save your acceptance. Please try again.",
      );
      setBusy(false);
      return;
    }
    router.push(next);
    router.refresh();
  }
  return (
    <>
      <button
        className="button button-primary"
        type="button"
        disabled={busy}
        onClick={accept}
      >
        {locale === "es" ? "Acepto los términos" : "I accept the terms"}
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </>
  );
}
