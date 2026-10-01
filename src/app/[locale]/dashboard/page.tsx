import { notFound, redirect } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowUpRight, FileText, Plus } from "lucide-react";
import { getLocale, content } from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { hasAcceptedCurrentTerms } from "@/lib/legal";
import { notificationLabel, statusLabel } from "@/lib/status";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const viewer = await requireViewer(locale, "/" + locale + "/dashboard");
  if (viewer.role === "admin") redirect("/admin");
  if (viewer.role === "developer") redirect("/developer");
  if (!(await hasAcceptedCurrentTerms(viewer.user.id)))
    redirect("/onboarding/terms");
  const supabase = await createClient();
  const { data: enquiries } = supabase
    ? await supabase
        .from("enquiries")
        .select("id,title,status,service_key,created_at")
        .eq("client_id", viewer.user.id)
        .order("created_at", { ascending: false })
    : { data: null };
  const { data: notifications } = supabase
    ? await supabase
        .from("notifications")
        .select("id,type,title,href,created_at")
        .eq("user_id", viewer.user.id)
        .is("read_at", null)
        .order("created_at", { ascending: false })
        .limit(4)
    : { data: null };
  return (
    <section className="portal-section container">
      <div className="portal-heading">
        <div>
          <p className="section-overline">
            {locale === "es" ? "Tu espacio" : "Your space"}
          </p>
          <h1>{locale === "es" ? "Tus proyectos" : "Your projects"}</h1>
          <p>
            {locale === "es"
              ? "Tus pedidos y próximos pasos, en un solo lugar."
              : "Your briefs and next steps, all in one place."}
          </p>
        </div>
        <Link href={"/" + locale + "/start"} className="button button-primary">
          <Plus size={18} />
          {content[locale].nav.start}
        </Link>
      </div>
      {notifications && notifications.length > 0 && (
        <div className="portal-notifications">
          {notifications.map((item) => (
            <Link key={item.id} href={item.href}>
              <span className="notice-dot" />
              {notificationLabel(item.type, item.title, locale)}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      )}
      <div className="portal-list">
        <div className="portal-list-heading">
          <h2>{locale === "es" ? "Pedidos" : "Briefs"}</h2>
          <span>{enquiries?.length || 0}</span>
        </div>
        {enquiries?.length ? (
          enquiries.map((item) => (
            <Link
              className="portal-row"
              href={"/" + locale + "/dashboard/briefs/" + item.id}
              key={item.id}
            >
              <span className="portal-row-icon">
                <FileText size={20} />
              </span>
              <span className="portal-row-main">
                <strong>{item.title}</strong>
                <small>
                  {content[locale].services[
                    item.service_key as keyof typeof content.es.services
                  ]?.name || item.service_key}{" "}
                  ·{" "}
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
            <FileText size={31} />
            <h3>
              {locale === "es" ? "Todavía no hay pedidos." : "No briefs yet."}
            </h3>
            <p>
              {locale === "es"
                ? "Contanos tu idea para dar el primer paso."
                : "Tell us your idea to take the first step."}
            </p>
            <Link href={"/" + locale + "/start"} className="underlined-link">
              {content[locale].nav.start}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
