import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { safeAccountPath } from "@/lib/routes";
import { hasSupabaseApiConfig } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeAccountPath(url.searchParams.get("next") || undefined);
  const response = NextResponse.redirect(new URL(next, url.origin));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (
    !code ||
    !supabaseUrl ||
    !anonKey ||
    !hasSupabaseApiConfig(supabaseUrl, anonKey)
  )
    return NextResponse.redirect(new URL("/signin?error=callback", url.origin));
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(items) {
        items.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return error
    ? NextResponse.redirect(new URL("/signin?error=callback", url.origin))
    : response;
}
