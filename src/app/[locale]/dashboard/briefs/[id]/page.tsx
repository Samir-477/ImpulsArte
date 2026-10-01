import { notFound, redirect } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getLocale, content } from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MessageComposer } from "@/components/message-composer";
import { QuoteDecision } from "@/components/quote-decision";
import { AttachmentDownload } from "@/components/attachment-download";
import { statusLabel } from "@/lib/status";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ files?: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = getLocale(rawLocale);
  if (!locale) notFound();
  const viewer = await requireViewer(
    locale,
    "/" + locale + "/dashboard/briefs/" + id,
  );
  if (viewer.role === "admin") redirect("/admin/enquiries/" + id);
  if (viewer.role === "developer") redirect("/developer/assignments/" + id);
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data: enquiry } = await supabase
    .from("enquiries")
    .select("id,title,summary,timeline,status,service_key,created_at")
    .eq("id", id)
    .eq("client_id", viewer.user.id)
    .maybeSingle();
  if (!enquiry) notFound();
  const [
    { data: messages },
    { data: quotes },
    { data: attachments },
    { data: project },
  ] = await Promise.all([
    supabase
      .from("messages")
      .select("id,sender_id,body,created_at")
      .eq("enquiry_id", id)
      .order("created_at"),
    supabase
      .from("quotes")
      .select("id,scope,amount_ars,status,revision,sent_at")
      .eq("enquiry_id", id)
      .neq("status", "draft")
      .order("revision", { ascending: false }),
    supabase
      .from("enquiry_attachments")
      .select("id,file_name,object_path")
      .eq("enquiry_id", id),
    supabase
      .from("projects")
      .select("id,status")
      .eq("enquiry_id", id)
      .maybeSingle(),
  ]);
  const { data: milestones } = project
    ? await supabase
        .from("milestones")
        .select("id,title,status,position")
        .eq("project_id", project.id)
        .order("position")
    : { data: null };
  const wa = process.env.NEXT_PUBLIC_AGENCY_WHATSAPP?.replace(/\D/g, "");
  const whatsapp = wa
    ? "https://wa.me/" +
      wa +
      "?text=" +
      encodeURIComponent("ImpulsArte project " + id.slice(0, 8))
    : null;
  const partial = (await searchParams).files === "partial";
  return (
    <section className="portal-section container">
      <Link href={"/" + locale + "/dashboard"} className="back-link">
        <ArrowLeft size={16} />
        {locale === "es" ? "Volver a tus proyectos" : "Back to your projects"}
      </Link>
      <div className="portal-heading">
        <div>
          <p className="section-overline">
            {
              content[locale].services[
                enquiry.service_key as keyof typeof content.es.services
              ]?.name
            }
          </p>
          <h1>{enquiry.title}</h1>
          <p>
            {locale === "es" ? "Referencia" : "Reference"} ·{" "}
            {id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <span className="status-pill">
          {statusLabel(enquiry.status, locale)}
        </span>
      </div>
      {partial && (
        <p role="alert" className="form-notice">
          {locale === "es"
            ? "El pedido se guardó, pero uno o más archivos no pudieron subirse."
            : "Your brief was saved, but one or more files could not be uploaded."}
        </p>
      )}
      <div className="portal-detail-grid">
        <div>
          <div className="portal-card">
            <h2>{locale === "es" ? "Tu pedido" : "Your brief"}</h2>
            <p className="brief-text">{enquiry.summary}</p>
            {enquiry.timeline && (
              <p className="small-muted">
                {locale === "es" ? "Plazo: " : "Timeline: "}
                {enquiry.timeline}
              </p>
            )}
            {attachments && attachments.length > 0 && (
              <div className="attachment-list">
                {attachments.map((file) => (
                  <AttachmentDownload
                    key={file.id}
                    locale={locale}
                    path={file.object_path}
                    name={file.file_name}
                  />
                ))}
              </div>
            )}
          </div>
          {project && (
            <div className="portal-card">
              <h2>
                {locale === "es" ? "Avance del proyecto" : "Project progress"}
              </h2>
              <div className="milestone-list">
                {milestones?.length ? (
                  milestones.map((milestone) => (
                    <div key={milestone.id}>
                      <span
                        className={"milestone-dot status-" + milestone.status}
                      />
                      <strong>{milestone.title}</strong>
                      <small>{statusLabel(milestone.status, locale)}</small>
                    </div>
                  ))
                ) : (
                  <p className="small-muted">
                    {locale === "es"
                      ? "Tu equipo agregará los hitos del proyecto."
                      : "Your team will add project milestones."}
                  </p>
                )}
              </div>
            </div>
          )}
          {quotes && quotes.length > 0 && (
            <div className="portal-card">
              <h2>{locale === "es" ? "Propuesta" : "Proposal"}</h2>
              {quotes.map((quote) => (
                <div className="quote-card" key={quote.id}>
                  <div className="quote-card-top">
                    <strong>
                      ARS{" "}
                      {new Intl.NumberFormat(
                        locale === "es" ? "es-AR" : "en-US",
                        { maximumFractionDigits: 2 },
                      ).format(Number(quote.amount_ars))}
                    </strong>
                    <span className="status-pill">
                      {statusLabel(quote.status, locale)}
                    </span>
                  </div>
                  <p>{quote.scope}</p>
                  {quote.status === "sent" && (
                    <QuoteDecision locale={locale} quoteId={quote.id} />
                  )}
                  {quote.status === "client_approved" && (
                    <p className="small-muted">
                      {locale === "es"
                        ? "Aprobaste esta propuesta. El equipo confirmará el inicio."
                        : "You approved this proposal. The team will confirm the start."}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <aside>
          <div className="portal-card">
            <h2>{locale === "es" ? "Conversación" : "Conversation"}</h2>
            <div className="message-list">
              {messages?.length ? (
                messages.map((message) => (
                  <div
                    className={
                      message.sender_id === viewer.user.id
                        ? "message own-message"
                        : "message"
                    }
                    key={message.id}
                  >
                    <span>
                      {message.sender_id === viewer.user.id
                        ? locale === "es"
                          ? "Vos"
                          : "You"
                        : locale === "es"
                          ? "Equipo ImpulsArte"
                          : "ImpulsArte team"}
                    </span>
                    <p>{message.body}</p>
                    <small>
                      {new Date(message.created_at).toLocaleString(
                        locale === "es" ? "es-AR" : "en-US",
                      )}
                    </small>
                  </div>
                ))
              ) : (
                <p className="small-muted">
                  {locale === "es"
                    ? "Todavía no hay mensajes. Podés escribirnos acá."
                    : "No messages yet. You can write to us here."}
                </p>
              )}
            </div>
            <MessageComposer
              locale={locale}
              enquiryId={id}
              userId={viewer.user.id}
            />
          </div>
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-card"
            >
              <span>
                {locale === "es" ? "¿Preferís WhatsApp?" : "Prefer WhatsApp?"}
              </span>
              <strong>
                {locale === "es"
                  ? "Escribile a nuestro equipo"
                  : "Message our team"}
              </strong>
              <ArrowUpRight size={18} />
            </a>
          )}
        </aside>
      </div>
    </section>
  );
}
