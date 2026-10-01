import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/content";
import { hasAcceptedCurrentTerms } from "@/lib/legal";
import { visiblePath } from "@/lib/routes";

export type AppRole = "client" | "developer" | "admin";

export async function getViewer() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,role,full_name,developer_status")
    .eq("id", user.id)
    .single();
  return {
    user,
    role: (profile?.role || "client") as AppRole,
    name: (profile?.full_name || user.email || "") as string,
    developerStatus: profile?.developer_status as string | undefined,
  };
}

export async function requireViewer(locale: Locale, next: string) {
  const viewer = await getViewer();
  if (!viewer)
    redirect("/signin?next=" + encodeURIComponent(visiblePath(next)));
  if (
    !next.includes("/onboarding/terms") &&
    !(await hasAcceptedCurrentTerms(viewer.user.id))
  )
    redirect("/onboarding/terms?next=" + encodeURIComponent(visiblePath(next)));
  return viewer;
}
