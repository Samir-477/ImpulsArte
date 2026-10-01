"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";
import { statusLabel } from "@/lib/status";

type Invitation = {
  id: string;
  email: string;
  status: string;
  created_at: string;
  user_id: string | null;
  profile: {
    full_name: string | null;
    developer_city: string | null;
    developer_skills: string[];
    developer_portfolio_url: string | null;
    developer_bio: string | null;
  } | null;
};
export function DeveloperInvites({
  locale,
  adminId,
  invitations,
}: {
  locale: Locale;
  adminId: string;
  invitations: Invitation[];
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function invite(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const result = await supabase.from("developer_invitations").insert({
      email: email.trim().toLowerCase(),
      invited_by: adminId,
      expires_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    });
    setBusy(false);
    if (result.error) setError(result.error.message);
    else {
      setEmail("");
      router.refresh();
    }
  }
  async function review(id: string, approval: boolean) {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const result = await supabase.rpc("review_developer", {
      invitation: id,
      approval,
    });
    setBusy(false);
    if (result.error) setError(result.error.message);
    else router.refresh();
  }
  return (
    <>
      <form onSubmit={invite} className="portal-card invite-form">
        <h2>
          {locale === "es" ? "Invitar desarrollador" : "Invite developer"}
        </h2>
        <p className="small-muted">
          {locale === "es"
            ? "El acceso requiere una invitación y tu aprobación posterior."
            : "Access requires an invitation and your later approval."}
        </p>
        <div className="inline-form">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="developer@example.com"
            required
          />
          <button
            type="submit"
            className="button button-primary"
            disabled={busy}
          >
            {locale === "es" ? "Invitar" : "Invite"}
          </button>
        </div>
      </form>
      <div className="portal-list invite-list">
        <div className="portal-list-heading">
          <h2>{locale === "es" ? "Invitaciones" : "Invitations"}</h2>
        </div>
        {invitations.map((invite) => (
          <div key={invite.id} className="portal-row">
            <span className="portal-row-main">
              <strong>{invite.email}</strong>
              <small>
                {new Date(invite.created_at).toLocaleDateString(
                  locale === "es" ? "es-AR" : "en-US",
                )}
              </small>
              {invite.profile && (
                <span className="developer-review-details">
                  <b>{invite.profile.full_name}</b> ·{" "}
                  {invite.profile.developer_city}, India
                  <br />
                  {invite.profile.developer_skills.join(", ")}
                  <br />
                  {invite.profile.developer_bio}
                  {invite.profile.developer_portfolio_url && (
                    <>
                      <br />
                      <a
                        href={invite.profile.developer_portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {locale === "es" ? "Ver portfolio" : "View portfolio"}
                      </a>
                    </>
                  )}
                </span>
              )}
            </span>
            <span className="status-pill">
              {statusLabel(invite.status, locale)}
            </span>
            {invite.status === "pending_review" && (
              <span className="review-actions">
                <button onClick={() => review(invite.id, true)} disabled={busy}>
                  {locale === "es" ? "Aprobar" : "Approve"}
                </button>
                <button
                  onClick={() => review(invite.id, false)}
                  disabled={busy}
                >
                  {locale === "es" ? "Rechazar" : "Reject"}
                </button>
              </span>
            )}
          </div>
        ))}
        {!invitations.length && (
          <p className="small-muted empty-note">
            {locale === "es"
              ? "Todavía no hay invitaciones."
              : "No invitations yet."}
          </p>
        )}
      </div>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </>
  );
}
