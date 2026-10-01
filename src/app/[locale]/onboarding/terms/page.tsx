import { notFound, redirect } from "next/navigation";
import { getLocale, content } from "@/lib/content";
import { getPublishedLegal, hasAcceptedCurrentTerms } from "@/lib/legal";
import { requireViewer } from "@/lib/auth";
import { TermsAccept } from "@/components/terms-accept";
import { safeAccountPath } from "@/lib/routes";
export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const next = safeAccountPath((await searchParams).next);
  const viewer = await requireViewer(
    locale,
    "/onboarding/terms?next=" + encodeURIComponent(next),
  );
  if (await hasAcceptedCurrentTerms(viewer.user.id)) redirect(next);
  const legal = await getPublishedLegal("terms", locale);
  return (
    <section className="legal-page container">
      <p className="section-overline">ImpulsArte</p>
      <h1>{locale === "es" ? "Antes de empezar" : "Before we begin"}</h1>
      <p>
        {locale === "es"
          ? "Leé los términos para poder compartir y seguir tu proyecto."
          : "Read the terms before sharing and following your project."}
      </p>
      {legal ? (
        <>
          <div className="legal-body legal-accept-body">{legal.body}</div>
          <TermsAccept locale={locale} version={legal.version} next={next} />
        </>
      ) : (
        <p className="form-notice">{content[locale].common.legalPending}</p>
      )}
    </section>
  );
}
