import { notFound, redirect } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowLeft } from "lucide-react";
import { getLocale } from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminEnquiryControls } from "@/components/admin-enquiry-controls";
import { MessageComposer } from "@/components/message-composer";
import { AttachmentDownload } from "@/components/attachment-download";
import { MilestoneStatus } from "@/components/milestone-status";
import { statusLabel } from "@/lib/status";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale = getLocale(raw);
  if (!locale) notFound();
  const viewer = await requireViewer(
    locale,
    "/" + locale + "/admin/enquiries/" + id,
  );
  if (viewer.role !== "admin") redirect("/dashboard");
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data: enquiry } = await supabase
    .from("enquiries")
    .select("id,title,summary,timeline,status,service_key,client_id,created_at")
    .eq("id", id)
    .maybeSingle();
  if (!enquiry) notFound();
  const [
    clientResult,
    messagesResult,
    quotesResult,
    developersResult,
    assignmentsResult,
    projectResult,
    attachmentsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", enquiry.client_id)
      .maybeSingle(),
    supabase
      .from("messages")
      .select("id,body,sender_id,created_at")
      .eq("enquiry_id", id)
      .order("created_at"),
    supabase
      .from("quotes")
      .select("id,scope,amount_ars,status,revision")
      .eq("enquiry_id", id)
      .order("revision", { ascending: false }),
    supabase
      .from("profiles")
      .select("id,full_name")
      .eq("role", "developer")
      .eq("developer_status", "approved")
      .eq("country_code", "IN"),
    supabase.from("assignments").select("developer_id").eq("enquiry_id", id),
    supabase
      .from("projects")
      .select("id,status")
      .eq("enquiry_id", id)
      .maybeSingle(),
    supabase
      .from("enquiry_attachments")
      .select("id,file_name,object_path")
      .eq("enquiry_id", id),
  ]);
  const project = projectResult.data;
  const { data: milestones } = project
    ? await supabase
        .from("milestones")
        .select("id,title,status")
        .eq("project_id", project.id)
        .order("position")
    : { data: null };
  const assignedIds = (assignmentsResult.data || []).map(
    (item) => item.developer_id,
  );
  const approvedQuote = quotesResult.data?.find(
    (item) => item.status === "client_approved",
  );
  return (
    <section className="portal-section container">
      <Link href={"/" + locale + "/admin"} className="back-link">
        <ArrowLeft size={16} />
        {locale === "es" ? "Volver al panel" : "Back to workspace"}
      </Link>
      <div className="portal-heading">
        <div>
          <p className="section-overline">
            {clientResult.data?.full_name ||
              (locale === "es" ? "Cliente" : "Client")}
          </p>
          <h1>{enquiry.title}</h1>
          <p>
            {id.slice(0, 8).toUpperCase()} · {enquiry.service_key}
          </p>
        </div>
        <span className="status-pill">
          {statusLabel(enquiry.status, locale)}
        </span>
      </div>
      <div className="portal-detail-grid">
        <div>
          <div className="portal-card">
            <h2>{locale === "es" ? "Pedido" : "Brief"}</h2>
            <p className="brief-text">{enquiry.summary}</p>
            {enquiry.timeline && (
              <p className="small-muted">{enquiry.timeline}</p>
            )}
            {attachmentsResult.data && attachmentsResult.data.length > 0 && (
              <div className="attachment-list">
                {attachmentsResult.data.map((file) => (
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
          <div className="portal-card">
            <h2>{locale === "es" ? "Conversación" : "Conversation"}</h2>
            <div className="message-list">
              {messagesResult.data?.length ? (
                messagesResult.data.map((message) => (
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
                          ? "Participante"
                          : "Participant"}
                    </span>
                    <p>{message.body}</p>
                  </div>
                ))
              ) : (
                <p className="small-muted">
                  {locale === "es"
                    ? "Todavía no hay mensajes."
                    : "No messages yet."}
                </p>
              )}
            </div>
            <MessageComposer
              locale={locale}
              enquiryId={id}
              userId={viewer.user.id}
            />
          </div>
          {quotesResult.data && quotesResult.data.length > 0 && (
            <div className="portal-card">
              <h2>{locale === "es" ? "Propuestas" : "Proposals"}</h2>
              {quotesResult.data.map((quote) => (
                <div className="quote-card" key={quote.id}>
                  <div className="quote-card-top">
                    <strong>
                      ARS {Number(quote.amount_ars).toLocaleString("es-AR")}
                    </strong>
                    <span className="status-pill">
                      {statusLabel(quote.status, locale)}
                    </span>
                  </div>
                  <p>{quote.scope}</p>
                </div>
              ))}
            </div>
          )}
          {project && (
            <div className="portal-card">
              <h2>{locale === "es" ? "Hitos" : "Milestones"}</h2>
              <div className="milestone-list">
                {milestones?.map((item) => (
                  <div key={item.id}>
                    <span className={"milestone-dot status-" + item.status} />
                    <strong>{item.title}</strong>
                    <MilestoneStatus
                      locale={locale}
                      id={item.id}
                      value={item.status}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside>
          <AdminEnquiryControls
            locale={locale}
            enquiryId={id}
            developers={developersResult.data || []}
            assignedIds={assignedIds}
            approvedQuoteId={approvedQuote?.id}
            projectId={project?.id}
          />
        </aside>
      </div>
    </section>
  );
}
