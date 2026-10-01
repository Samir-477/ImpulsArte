import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { MotionExperience } from "@/components/motion-experience";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getLocale } from "@/lib/content";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "../globals.css";
import "../marketing.css";
import "../motion.css";
import "../agency-motion.css";
import "../studio-story.css";
import "../site-shell.css";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "ImpulsArte — Digital work, made clear",
    template: "%s | ImpulsArte",
  },
  description:
    "Websites, web apps, business services and digital consultancy, shaped around your goals.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const storedTheme = (await cookies()).get("caucebit-theme")?.value;
  const theme =
    storedTheme === "dark" || storedTheme === "light" ? storedTheme : undefined;
  return (
    <html
      lang={locale === "es" ? "es-AR" : "en"}
      data-theme={theme}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <MotionExperience locale={locale}>
          <SiteHeader locale={locale} />
          <main>{children}</main>
          <SiteFooter locale={locale} />
        </MotionExperience>
      </body>
    </html>
  );
}
