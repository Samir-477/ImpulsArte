"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";

export function QuoteDecision({
  locale,
  quoteId,
}: {
  locale: Locale;
  quoteId: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function decide(decision: "client_approved" | "declined") {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const result = await supabase.rpc("decide_quote", {
      quote: quoteId,
      decision,
    });
    setBusy(false);
    if (result.error)
      setError(
        locale === "es"
          ? "No pudimos guardar tu decisión. Actualizá la página e intentá de nuevo."
          : "We could not save your decision. Refresh the page and try again.",
      );
    else router.refresh();
  }
  return (
    <div className="quote-actions">
      <button
        className="button button-primary"
        type="button"
        disabled={busy}
        onClick={() => decide("client_approved")}
      >
        {locale === "es" ? "Aprobar propuesta" : "Approve proposal"}
      </button>
      <button
        className="button button-outline"
        type="button"
        disabled={busy}
        onClick={() => decide("declined")}
      >
        {locale === "es" ? "Rechazar" : "Decline"}
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </div>
  );
}
