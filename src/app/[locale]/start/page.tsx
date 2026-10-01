import { notFound, redirect } from "next/navigation";
import { BriefForm } from "@/components/brief-form";
import { getLocale, serviceKeys, type ServiceKey } from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { hasAcceptedCurrentTerms } from "@/lib/legal";
import { getPublicServices } from "@/lib/public-services";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const viewer = await requireViewer(locale, "/" + locale + "/start");
  if (viewer.role !== "client") redirect("/dashboard");
  if (!(await hasAcceptedCurrentTerms(viewer.user.id)))
    redirect("/onboarding/terms?next=" + encodeURIComponent("/start"));
  const candidate = (await searchParams).service;
  const services = await getPublicServices(locale);
  const availableServices = serviceKeys.filter(
    (key) => services[key].published,
  );
  if (!availableServices.length) notFound();
  const service =
    candidate && availableServices.includes(candidate as ServiceKey)
      ? (candidate as ServiceKey)
      : undefined;
  return (
    <section className="brief-section">
      <div className="container brief-layout">
        <div className="brief-intro">
          <p className="section-overline">
            {locale === "es"
              ? "Tu proyecto empieza acá"
              : "Your project starts here"}
          </p>
          <h1>
            {locale === "es"
              ? "Contanos qué tenés en mente."
              : "Tell us what you have in mind."}
          </h1>
          <p>
            {locale === "es"
              ? "No hace falta un documento perfecto. Compartí lo que sabés y seguimos la conversación juntos."
              : "You do not need a perfect brief. Share what you know and we will continue the conversation together."}
          </p>
          <div className="brief-side-note">
            ✳{" "}
            <span>
              {locale === "es"
                ? "Sin pagos ni compromisos al enviar el pedido."
                : "No payment or commitment when you send a brief."}
            </span>
          </div>
        </div>
        <BriefForm
          locale={locale}
          initialService={service}
          availableServices={availableServices}
        />
      </div>
    </section>
  );
}
