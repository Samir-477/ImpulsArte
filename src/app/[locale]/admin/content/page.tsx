import { notFound, redirect } from "next/navigation";
import Link from "@/components/locale-link";
import { ArrowLeft } from "lucide-react";
import {
  getLocale,
  content,
  serviceKeys,
  type ServiceKey,
} from "@/lib/content";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ServiceEditor } from "@/components/service-editor";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  const viewer = await requireViewer(locale, "/" + locale + "/admin/content");
  if (viewer.role !== "admin") redirect("/dashboard");
  const supabase = await createClient();
  const [{ data: services }, { data: translations }] = supabase
    ? await Promise.all([
        supabase.from("services").select("key,starting_price_ars,published"),
        supabase
          .from("service_localizations")
          .select(
            "service_key,locale,name,eyebrow,summary,description,features",
          ),
      ])
    : [{ data: null }, { data: null }];
  const initial = Object.fromEntries(
    serviceKeys.map((key) => {
      const record = services?.find((row) => row.key === key);
      const makeLocale = (lang: "es" | "en") => {
        const row = translations?.find(
          (item) => item.service_key === key && item.locale === lang,
        );
        const fallback = content[lang].services[key];
        return {
          name: row?.name || fallback.name,
          eyebrow: row?.eyebrow || fallback.eyebrow,
          summary: row?.summary || fallback.short,
          description: row?.description || fallback.detail,
          features: row?.features?.length ? row.features : [...fallback.items],
        };
      };
      return [
        key,
        {
          price:
            record?.starting_price_ars === null ||
            record?.starting_price_ars === undefined
              ? ""
              : String(record.starting_price_ars),
          published: record?.published ?? true,
          es: makeLocale("es"),
          en: makeLocale("en"),
        },
      ];
    }),
  ) as Record<
    ServiceKey,
    {
      price: string;
      published: boolean;
      es: {
        name: string;
        eyebrow: string;
        summary: string;
        description: string;
        features: string[];
      };
      en: {
        name: string;
        eyebrow: string;
        summary: string;
        description: string;
        features: string[];
      };
    }
  >;
  return (
    <section className="portal-section container">
      <Link href={"/" + locale + "/admin"} className="back-link">
        <ArrowLeft size={16} />
        {locale === "es" ? "Volver al panel" : "Back to workspace"}
      </Link>
      <div className="portal-heading">
        <div>
          <p className="section-overline">ImpulsArte / Admin</p>
          <h1>
            {locale === "es" ? "Contenido de servicios" : "Service content"}
          </h1>
          <p>
            {locale === "es"
              ? "Actualizá los textos en ambos idiomas y los precios iniciales."
              : "Update both language versions and starting prices."}
          </p>
        </div>
      </div>
      <ServiceEditor locale={locale} initial={initial} />
    </section>
  );
}
