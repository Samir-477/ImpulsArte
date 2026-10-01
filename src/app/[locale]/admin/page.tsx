import { notFound, redirect } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowUpRight, FileText, Users, Pencil } from "lucide-react";
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
  const viewer = await requireViewer(locale, "/" + locale + "/admin");
  if (viewer.role !== "admin") redirect("/dashboard");
  const supabase = await createClient();
  const { data: enquiries } = supabase
    ? await supabase
        .from("enquiries")
        .select("id,title,status,created_at")
        .order("created_at", { ascending: false })
        .limit(30)
    : { data: null };
  const { count: pending } = supabase
    ? await supabase
        .from("developer_invitations")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_review")
    : { count: 0 };
  return (
    <section className="portal-section container">
      <div className="portal-heading">
        <div>
          <p className="section-overline">ImpulsArte / Admin</p>
          <h1>{locale === "es" ? "Panel de trabajo" : "Workspace"}</h1>
          <p>
            {locale === "es"
              ? "Revisá pedidos y coordiná al equipo."
              : "Review briefs and coordinate the team."}
          </p>
        </div>
        <div className="admin-heading-actions">
          <Link
            className="button button-outline"
            href={"/" + locale + "/admin/content"}
          >
            <Pencil size={17} />
            {locale === "es" ? "Servicios" : "Services"}
          </Link>
          <Link
            className="button button-outline"
            href={"/" + locale + "/admin/developers"}
          >
            <Users size={18} />
            {locale === "es" ? "Desarrolladores" : "Developers"}
            {pending ? " (" + pending + ")" : ""}
          </Link>
        </div>
      </div>
      <div className="portal-list">
        <div className="portal-list-heading">
          <h2>{locale === "es" ? "Pedidos recientes" : "Recent briefs"}</h2>
          <span>{enquiries?.length || 0}</span>
        </div>
        {enquiries?.length ? (
          enquiries.map((item) => (
            <Link
              key={item.id}
              href={"/" + locale + "/admin/enquiries/" + item.id}
              className="portal-row"
            >
              <span className="portal-row-icon">
                <FileText size={20} />
              </span>
              <span className="portal-row-main">
                <strong>{item.title}</strong>
                <small>
                  {new Date(item.created_at).toLocaleDateString(
                    locale === "es" ? "es-AR" : "en-US",
                  )}
                </small>
              </span>
              <span className="status-pill">
                {statusLabel(item.status, locale)}
              </span>
              <ArrowUpRight size={17} />
            </Link>
          ))
        ) : (
          <div className="portal-empty">
            <FileText size={30} />
            <h3>
              {locale === "es" ? "Todavía no hay pedidos." : "No briefs yet."}
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
