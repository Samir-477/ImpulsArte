"use client";

import Link from "@/components/locale-link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import type { Locale } from "@/lib/content";
import { notificationLabel } from "@/lib/status";
import { visiblePath } from "@/lib/routes";

type Notice = {
  id: string;
  type: string;
  title: string;
  href: string;
  created_at: string;
  read_at: string | null;
};
export function NotificationList({
  locale,
  notices,
}: {
  locale: Locale;
  notices: Notice[];
}) {
  const router = useRouter();
  async function open(notice: Notice) {
    const supabase = createClient();
    if (supabase && !notice.read_at)
      await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", notice.id);
    router.push(visiblePath(notice.href));
  }
  return (
    <div className="portal-list">
      <div className="portal-list-heading">
        <h2>{locale === "es" ? "Actualizaciones" : "Updates"}</h2>
        <span>{notices.length}</span>
      </div>
      {notices.length ? (
        notices.map((notice) => (
          <button
            className={
              notice.read_at ? "notification-row read" : "notification-row"
            }
            key={notice.id}
            onClick={() => open(notice)}
          >
            <span className="notice-dot" />
            <span>
              <strong>
                {notificationLabel(notice.type, notice.title, locale)}
              </strong>
              <small>
                {new Date(notice.created_at).toLocaleString(
                  locale === "es" ? "es-AR" : "en-US",
                )}
              </small>
            </span>
            <ArrowUpRight size={17} />
          </button>
        ))
      ) : (
        <div className="portal-empty">
          <h3>
            {locale === "es"
              ? "No hay novedades por ahora."
              : "No updates yet."}
          </h3>
          <p>
            {locale === "es"
              ? "Te avisaremos cuando haya algo nuevo en tus proyectos."
              : "We will let you know when there is news about your projects."}
          </p>
          <Link className="underlined-link" href={"/" + locale + "/dashboard"}>
            {locale === "es" ? "Volver a tu espacio" : "Back to your space"}
          </Link>
        </div>
      )}
    </div>
  );
}
