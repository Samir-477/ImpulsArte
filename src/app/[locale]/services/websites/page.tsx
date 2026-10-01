import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/service-detail";
import { getLocale } from "@/lib/content";
import { getPublicServices } from "@/lib/public-services";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) return {};
  const item = (await getPublicServices(locale)).websites;
  return locale
    ? {
        title: item.name,
        description: item.detail,
        alternates: {
          canonical: "/services/websites",
        },
      }
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  return <ServiceDetail locale={locale} service="websites" />;
}
