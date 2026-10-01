import { notFound } from "next/navigation";
import { getLocale } from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NotificationList } from "@/components/notification-list";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const viewer = await requireViewer(locale, "/" + locale + "/notifications");
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase
        .from("notifications")
        .select("id,type,title,href,created_at,read_at")
        .eq("user_id", viewer.user.id)
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: null };
  return (
    <section className="portal-section container">
      <div className="portal-heading">
        <div>
          <p className="section-overline">ImpulsArte</p>
          <h1>{locale === "es" ? "Notificaciones" : "Notifications"}</h1>
        </div>
      </div>
      <NotificationList locale={locale} notices={data || []} />
    </section>
  );
}
