import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { hasSupabaseApiConfig } from "@/lib/supabase/config";

const localeCookie = "caucebit-locale";
const privatePath =
  /^\/(dashboard|admin|developer|start|onboarding|notifications)(\/|$)/;

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const oldLocalePath = path.match(/^\/(es|en)(\/.*)?$/);
  if (oldLocalePath) {
    const destination = request.nextUrl.clone();
    destination.pathname = oldLocalePath[2] || "/";
    const response = NextResponse.redirect(destination, 308);
    response.cookies.set(localeCookie, oldLocalePath[1], {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  const locale =
    request.cookies.get(localeCookie)?.value === "en" ? "en" : "es";
  const destination = request.nextUrl.clone();
  destination.pathname = "/" + locale + (path === "/" ? "" : path);
  let response = NextResponse.rewrite(destination, { request });
  response.headers.append("Vary", "Cookie");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (
    !privatePath.test(path) ||
    !url ||
    !key ||
    !hasSupabaseApiConfig(url, key)
  )
    return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(items) {
        items.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.rewrite(destination, { request });
        response.headers.append("Vary", "Cookie");
        items.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|auth|icon.svg|robots.txt|sitemap.xml|.*\\..*).*)"],
};
