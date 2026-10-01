import { createBrowserClient } from "@supabase/ssr";
import { hasSupabaseApiConfig } from "@/lib/supabase/config";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !hasSupabaseApiConfig(url, key)) return null;
  return createBrowserClient(url, key);
}
