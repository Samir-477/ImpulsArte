"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";

type Developer = { id: string; full_name: string | null };
export function AdminEnquiryControls({
  locale,
  enquiryId,
  developers,
  assignedIds,
  approvedQuoteId,
  projectId,
}: {
  locale: Locale;
  enquiryId: string;
  developers: Developer[];
  assignedIds: string[];
  approvedQuoteId?: string;
  projectId?: string;
}) {
  const router = useRouter();
  const [developer, setDeveloper] = useState("");
  const [scope, setScope] = useState("");
  const [amount, setAmount] = useState("");
  const [milestone, setMilestone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function run(
    action: () => Promise<{ error: { message: string } | null }>,
  ) {
    setBusy(true);
    setError("");
    const result = await action();
    setBusy(false);
    if (result.error) setError(result.error.message);
    else router.refresh();
  }
  const supabase = createClient();
  return (
    <div className="admin-controls">
      <div className="portal-card">
        <h2>
          {locale === "es" ? "Asignar desarrollador" : "Assign developer"}
        </h2>
        <p className="small-muted">
          {locale === "es"
            ? "Solo aparecen desarrolladores aprobados."
            : "Only approved developers appear."}
        </p>
        <div className="inline-form">
          <select
            aria-label="Developer"
            value={developer}
            onChange={(event) => setDeveloper(event.target.value)}
          >
            <option value="">
              {locale === "es"
                ? "Elegí un desarrollador"
                : "Choose a developer"}
            </option>
            {developers
              .filter((item) => !assignedIds.includes(item.id))
              .map((item) => (
                <option value={item.id} key={item.id}>
                  {item.full_name || item.id.slice(0, 8)}
                </option>
              ))}
          </select>
          <button
            className="button button-primary"
            disabled={!developer || busy || !supabase}
            onClick={() =>
              run(async () => {
                const result = await supabase!.rpc("assign_developer", {
                  enquiry: enquiryId,
                  developer,
                });
                if (!result.error) setDeveloper("");
                return result;
              })
            }
          >
            {locale === "es" ? "Asignar" : "Assign"}
          </button>
        </div>
      </div>
      <div className="portal-card">
        <h2>{locale === "es" ? "Enviar propuesta" : "Send proposal"}</h2>
        <p className="small-muted">
          {locale === "es"
            ? "Una nueva propuesta reemplaza la versión anterior. El pago se gestiona fuera del sitio."
            : "A new proposal replaces the previous version. Payment happens outside the site."}
        </p>
        <label htmlFor="quote-scope">
          {locale === "es" ? "Alcance" : "Scope"}
        </label>
        <textarea
          id="quote-scope"
          rows={5}
          minLength={20}
          value={scope}
          onChange={(event) => setScope(event.target.value)}
          placeholder={
            locale === "es"
              ? "Qué incluye la propuesta..."
              : "What the proposal includes..."
          }
        />
        <label htmlFor="quote-amount">
          {locale === "es" ? "Importe en ARS" : "Amount in ARS"}
        </label>
        <input
          id="quote-amount"
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <button
          className="button button-primary"
          disabled={
            scope.trim().length < 20 || Number(amount) <= 0 || busy || !supabase
          }
          onClick={() =>
            run(async () => {
              const result = await supabase!.rpc("send_quote", {
                enquiry: enquiryId,
                quote_scope: scope.trim(),
                amount: Number(amount),
              });
              if (!result.error) {
                setScope("");
                setAmount("");
              }
              return result;
            })
          }
        >
          {locale === "es" ? "Enviar propuesta" : "Send proposal"}
        </button>
      </div>
      {approvedQuoteId && !projectId && (
        <div className="portal-card">
          <h2>
            {locale === "es" ? "Confirmar inicio" : "Confirm project start"}
          </h2>
          <p className="small-muted">
            {locale === "es"
              ? "La propuesta fue aprobada por el cliente. Confirmá el inicio después de completar los pasos externos."
              : "The client approved the proposal. Confirm the start after completing offline steps."}
          </p>
          <button
            className="button button-primary"
            disabled={busy || !supabase}
            onClick={() =>
              run(
                async () =>
                  await supabase!.rpc("start_project", {
                    quote: approvedQuoteId,
                  }),
              )
            }
          >
            {locale === "es" ? "Iniciar proyecto" : "Start project"}
          </button>
        </div>
      )}
      {projectId && (
        <div className="portal-card">
          <h2>{locale === "es" ? "Agregar hito" : "Add milestone"}</h2>
          <div className="inline-form">
            <input
              value={milestone}
              onChange={(event) => setMilestone(event.target.value)}
              maxLength={120}
              placeholder={
                locale === "es" ? "Nombre del hito" : "Milestone name"
              }
            />
            <button
              className="button button-primary"
              disabled={!milestone.trim() || busy || !supabase}
              onClick={() =>
                run(async () => {
                  const result = await supabase!
                    .from("milestones")
                    .insert({ project_id: projectId, title: milestone.trim() });
                  if (!result.error) setMilestone("");
                  return result;
                })
              }
            >
              {locale === "es" ? "Agregar" : "Add"}
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
