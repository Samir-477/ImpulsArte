import { notFound, redirect } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowLeft } from "lucide-react";
import { getLocale } from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { MessageComposer } from "@/components/message-composer";
import { AttachmentDownload } from "@/components/attachment-download";
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
    "/" + locale + "/developer/assignments/" + id,
  );
  if (viewer.role === "admin") redirect("/admin/enquiries/" + id);
  if (viewer.role !== "developer" || viewer.developerStatus !== "approved")
    redirect("/developer");
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data: enquiry } = await supabase
    .from("enquiries")
    .select("id,title,summary,timeline,status")
    .eq("id", id)
    .maybeSingle();
  if (!enquiry) notFound();
  const [messagesResult, projectResult, attachmentsResult] = await Promise.all([
    supabase
      .from("messages")
      .select("id,body,sender_id,created_at")
      .eq("enquiry_id", id)
      .order("created_at"),
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
  return (
    <section className="portal-section container">
      <Link href={"/" + locale + "/developer"} className="back-link">
        <ArrowLeft size={16} />
        {locale === "es" ? "Volver a asignaciones" : "Back to assignments"}
      </Link>
      <div className="portal-heading">
        <div>
          <p className="section-overline">
            {locale === "es" ? "Proyecto asignado" : "Assigned project"}
          </p>
          <h1>{enquiry.title}</h1>
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
          {project && (
            <div className="portal-card">
              <h2>{locale === "es" ? "Hitos" : "Milestones"}</h2>
              <div className="milestone-list">
                {milestones?.map((item) => (
                  <div key={item.id}>
                    <span className={"milestone-dot status-" + item.status} />
                    <strong>{item.title}</strong>
                    <small>{statusLabel(item.status, locale)}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside>
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
        </aside>
      </div>
    </section>
  );
}
