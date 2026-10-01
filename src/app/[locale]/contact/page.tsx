import { notFound, permanentRedirect } from "next/navigation";
import { getLocale } from "@/lib/content";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getLocale((await params).locale);
  if (!locale) notFound();
  permanentRedirect("/about#contact");
}
