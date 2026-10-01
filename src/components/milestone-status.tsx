"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";
export function MilestoneStatus({
  locale,
  id,
  value,
}: {
  locale: Locale;
  id: string;
  value: string;
}) {
  const [status, setStatus] = useState(value);
  const [error, setError] = useState(false);
  const router = useRouter();
  async function change(next: string) {
    const supabase = createClient();
    if (!supabase) return;
    const previous = status;
    setStatus(next);
    setError(false);
    const result = await supabase
      .from("milestones")
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (result.error) {
      setStatus(previous);
      setError(true);
    } else router.refresh();
  }
  return (
    <span className="milestone-control">
      <select
        aria-label={locale === "es" ? "Estado del hito" : "Milestone status"}
        value={status}
        onChange={(event) => change(event.target.value)}
      >
        <option value="pending">
          {locale === "es" ? "Pendiente" : "Pending"}
        </option>
        <option value="active">
          {locale === "es" ? "En curso" : "Active"}
        </option>
        <option value="done">{locale === "es" ? "Terminado" : "Done"}</option>
      </select>
      {error && (
        <small role="alert">
          {locale === "es" ? "Error al guardar" : "Save failed"}
        </small>
      )}
    </span>
  );
}
