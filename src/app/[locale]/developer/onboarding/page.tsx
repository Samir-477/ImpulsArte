import { notFound, redirect } from "next/navigation";
import { getLocale } from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { ClaimInvitation } from "@/components/claim-invitation";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const viewer = await requireViewer(
    locale,
    "/" + locale + "/developer/onboarding",
  );
  if (viewer.role === "developer") redirect("/developer");
  if (viewer.role === "admin") redirect("/admin");
  return (
    <section className="portal-section container narrow-page">
      <p className="section-overline">ImpulsArte / Developer</p>
      <h1>{locale === "es" ? "Unite al equipo" : "Join the team"}</h1>
      <p>
        {locale === "es"
          ? "Si recibiste una invitación en este correo, confirmá tu ubicación para enviarla a revisión."
          : "If you received an invitation at this email, confirm your location to submit it for review."}
      </p>
      <ClaimInvitation locale={locale} />
    </section>
  );
}
