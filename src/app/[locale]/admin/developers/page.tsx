import { notFound, redirect } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowLeft } from "lucide-react";
import { getLocale } from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { DeveloperInvites } from "@/components/developer-invites";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const viewer = await requireViewer(
    locale,
    "/" + locale + "/admin/developers",
  );
  if (viewer.role !== "admin") redirect("/dashboard");
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase
        .from("developer_invitations")
        .select("id,email,status,created_at,user_id")
        .order("created_at", { ascending: false })
    : { data: null };
  const ids = (data || [])
    .map((item) => item.user_id)
    .filter((id): id is string => Boolean(id));
  const { data: profiles } =
    supabase && ids.length
      ? await supabase
          .from("profiles")
          .select(
            "id,full_name,developer_city,developer_skills,developer_portfolio_url,developer_bio",
          )
          .in("id", ids)
      : { data: null };
  const invitations = (data || []).map((item) => ({
    ...item,
    profile: profiles?.find((profile) => profile.id === item.user_id) || null,
  }));
  return (
    <section className="portal-section container">
      <Link href={"/" + locale + "/admin"} className="back-link">
        <ArrowLeft size={16} />
        {locale === "es" ? "Volver al panel" : "Back to workspace"}
      </Link>
      <div className="portal-heading">
        <div>
          <p className="section-overline">ImpulsArte / Admin</p>
          <h1>{locale === "es" ? "Desarrolladores" : "Developers"}</h1>
        </div>
      </div>
      <DeveloperInvites
        locale={locale}
        adminId={viewer.user.id}
        invitations={invitations}
      />
    </section>
  );
}
