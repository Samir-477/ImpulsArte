import { notFound } from "next/navigation";
import { getLocale, content } from "@/lib/content";
import { getPublishedLegal } from "@/lib/legal";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const legal = await getPublishedLegal("privacy", locale);
  return (
    <section className="legal-page container">
      <h1>{locale === "es" ? "Privacidad" : "Privacy"}</h1>
      {legal ? (
        <>
          <p className="legal-version">Version {legal.version}</p>
          <div className="legal-body">{legal.body}</div>
        </>
      ) : (
        <p>{content[locale].common.legalPending}</p>
      )}
    </section>
  );
}
