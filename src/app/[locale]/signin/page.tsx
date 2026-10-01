import { notFound, redirect } from "next/navigation";
import { SignInForm } from "@/components/sign-in-form";
import { getLocale } from "@/lib/content";
import { getViewer } from "@/lib/auth";
import { safeAccountPath } from "@/lib/routes";

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
  const viewer = await getViewer();
  if (viewer) redirect(next);
  return (
    <section className="auth-section">
      <div className="auth-panel">
        <p className="section-overline">
          {locale === "es"
            ? "Tu espacio en ImpulsArte"
            : "Your ImpulsArte space"}
        </p>
        <h1>{locale === "es" ? "Bienvenido de nuevo." : "Welcome back."}</h1>
        <p>
          {locale === "es"
            ? "Ingresá para compartir un proyecto o seguir su progreso."
            : "Sign in to share a project or follow its progress."}
        </p>
        <SignInForm
          locale={locale}
          next={next}
          googleEnabled={process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true"}
        />
      </div>
      <div className="auth-aside">
        <div className="auth-aside-content">
          <span>✳</span>
          <h2>
            {locale === "es"
              ? "Una idea clara cambia todo."
              : "A clear idea changes everything."}
          </h2>
          <p>
            {locale === "es"
              ? "Tu proyecto, tus conversaciones y los próximos pasos en un mismo lugar."
              : "Your project, conversations and next steps in one place."}
          </p>
        </div>
      </div>
    </section>
  );
}
