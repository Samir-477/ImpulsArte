type EmailJob = {
  id: string;
  recipient: string;
  template: string;
  payload: { title?: string; href?: string };
  attempts: number;
};
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendKey = Deno.env.get("RESEND_API_KEY") || "";
const from = Deno.env.get("EMAIL_FROM") || "";
const siteUrl = Deno.env.get("SITE_URL") || "";
const headers = {
  apikey: serviceKey,
  Authorization: "Bearer " + serviceKey,
  "Content-Type": "application/json",
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ] || char,
  );
}
async function update(id: string, patch: Record<string, unknown>) {
  await fetch(
    supabaseUrl + "/rest/v1/email_outbox?id=eq." + encodeURIComponent(id),
    { method: "PATCH", headers, body: JSON.stringify(patch) },
  );
}

Deno.serve(async (request) => {
  if (
    request.method !== "POST" ||
    request.headers.get("authorization") !== "Bearer " + serviceKey
  )
    return new Response("Unauthorized", { status: 401 });
  if (!supabaseUrl || !serviceKey || !resendKey || !from || !siteUrl)
    return new Response("Missing email configuration", { status: 503 });
  const claim = await fetch(supabaseUrl + "/rest/v1/rpc/claim_email_outbox", {
    method: "POST",
    headers,
    body: JSON.stringify({ batch_size: 20 }),
  });
  if (!claim.ok)
    return new Response("Could not claim email jobs", { status: 500 });
  const jobs = (await claim.json()) as EmailJob[];
  for (const job of jobs) {
    const title =
      job.template === "developer_invite"
        ? "ImpulsArte developer invitation / Invitación al equipo"
        : job.payload.title || "ImpulsArte update / Novedades";
    const path = job.payload.href || "/";
    const href =
      path.startsWith("/") && !path.startsWith("//")
        ? siteUrl.replace(/\/$/, "") + path
        : siteUrl;
    const html =
      "<p>" +
      escapeHtml(title) +
      '</p><p><a href="' +
      escapeHtml(href) +
      '">Open ImpulsArte / Abrir ImpulsArte</a></p>';
    try {
      const send = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + resendKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [job.recipient],
          subject: title,
          html,
        }),
      });
      if (!send.ok) throw new Error("Email provider rejected the request");
      await update(job.id, { status: "sent" });
    } catch {
      await update(job.id, {
        status: "failed",
        next_attempt_at: new Date(
          Date.now() + Math.min(3600000, 60000 * 2 ** job.attempts),
        ).toISOString(),
      });
    }
  }
  return Response.json({ processed: jobs.length });
});
