import { notFound, redirect } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowUpRight, FileText } from "lucide-react";
import { getLocale } from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { statusLabel } from "@/lib/status";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const viewer = await requireViewer(locale, "/" + locale + "/developer");
  if (viewer.role === "admin") redirect("/admin");
  if (viewer.role !== "developer") redirect("/dashboard");
  if (viewer.developerStatus !== "approved")
    return (
      <section className="portal-section container narrow-page">
        <p className="section-overline">ImpulsArte / Developer</p>
        <h1>
          {locale === "es"
            ? "Tu perfil está en revisión."
            : "Your profile is under review."}
        </h1>
        <p>
          {locale === "es"
            ? "Te avisaremos por correo cuando el equipo termine la revisión."
            : "We will email you when the team completes its review."}
        </p>
      </section>
    );
  const supabase = await createClient();
  const { data: assignments } = supabase
    ? await supabase
        .from("assignments")
        .select("enquiry_id,assigned_at,enquiries(id,title,status,service_key)")
        .eq("developer_id", viewer.user.id)
        .order("assigned_at", { ascending: false })
    : { data: null };
  return (
    <section className="portal-section container">
      <div className="portal-heading">
        <div>
          <p className="section-overline">ImpulsArte / Developer</p>
          <h1>{locale === "es" ? "Tus asignaciones" : "Your assignments"}</h1>
          <p>
            {locale === "es"
              ? "Proyectos asignados por el equipo."
              : "Projects assigned by the team."}
          </p>
        </div>
      </div>
      <div className="portal-list">
        <div className="portal-list-heading">
          <h2>{locale === "es" ? "Asignaciones" : "Assignments"}</h2>
          <span>{assignments?.length || 0}</span>
        </div>
        {assignments?.length ? (
          assignments.map((row) => {
            const raw = row.enquiries as unknown as {
              id: string;
              title: string;
              status: string;
            } | null;
            return raw ? (
              <Link
                key={row.enquiry_id}
                className="portal-row"
                href={"/" + locale + "/developer/assignments/" + row.enquiry_id}
              >
                <span className="portal-row-icon">
                  <FileText size={20} />
                </span>
                <span className="portal-row-main">
                  <strong>{raw.title}</strong>
                  <small>
                    {new Date(row.assigned_at).toLocaleDateString(
                      locale === "es" ? "es-AR" : "en-US",
                    )}
                  </small>
                </span>
                <span className="status-pill">
                  {statusLabel(raw.status, locale)}
                </span>
                <ArrowUpRight size={17} />
              </Link>
            ) : null;
          })
        ) : (
          <div className="portal-empty">
            <FileText size={30} />
            <h3>
              {locale === "es"
                ? "Todavía no tenés asignaciones."
                : "No assignments yet."}
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
