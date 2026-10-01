import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/content";

export async function getPublishedLegal(
  kind: "terms" | "privacy",
  locale: Locale,
) {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: latest } = await supabase
    .from("legal_documents")
    .select("version")
    .eq("kind", kind)
    .not("published_at", "is", null)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latest) return null;
  const { data } = await supabase
    .from("legal_documents")
    .select("kind,locale,version,body,published_at")
    .eq("kind", kind)
    .eq("locale", locale)
    .eq("version", latest.version)
    .not("published_at", "is", null)
    .maybeSingle();
  return data;
}

export async function hasAcceptedCurrentTerms(userId: string) {
  const supabase = await createClient();
  if (!supabase) return false;
  const { data: latest } = await supabase
    .from("legal_documents")
    .select("version")
    .eq("kind", "terms")
    .not("published_at", "is", null)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!latest) return false;
  const { data } = await supabase
    .from("legal_acceptances")
    .select("version")
    .eq("kind", "terms")
    .eq("version", latest.version)
    .eq("user_id", userId)
    .maybeSingle();
  return Boolean(data);
}
