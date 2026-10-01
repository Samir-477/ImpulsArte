import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  content,
  serviceKeys,
  type Locale,
  type ServiceKey,
} from "@/lib/content";
import { hasSupabaseApiConfig } from "@/lib/supabase/config";

export type DisplayService = {
  name: string;
  eyebrow: string;
  short: string;
  detail: string;
  items: string[];
  query: string;
  price: number | null;
  published: boolean;
};
export type DisplayServices = Record<ServiceKey, DisplayService>;

export async function getPublicServices(
  locale: Locale,
): Promise<DisplayServices> {
  const fallback = Object.fromEntries(
    serviceKeys.map((key) => [
      key,
      {
        ...content[locale].services[key],
        items: [...content[locale].services[key].items],
        price: null,
        published: true,
      },
    ]),
  ) as DisplayServices;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !hasSupabaseApiConfig(url, key)) return fallback;
  const supabase = createSupabaseClient(url, key, {
    auth: { persistSession: false },
  });
  const [servicesResult, translationsResult] = await Promise.all([
    supabase.from("services").select("key,starting_price_ars,published"),
    supabase
      .from("service_localizations")
      .select("service_key,name,eyebrow,summary,description,features")
      .eq("locale", locale),
  ]);
  if (!servicesResult.error) {
    for (const serviceKey of serviceKeys)
      fallback[serviceKey].published = false;
    for (const row of servicesResult.data || []) {
      const serviceKey = row.key as ServiceKey;
      if (fallback[serviceKey]) {
        fallback[serviceKey].price =
          row.starting_price_ars === null
            ? null
            : Number(row.starting_price_ars);
        fallback[serviceKey].published = row.published;
      }
    }
  }
  if (translationsResult.data)
    for (const row of translationsResult.data) {
      const serviceKey = row.service_key as ServiceKey;
      if (fallback[serviceKey]) {
        fallback[serviceKey].name = row.name;
        fallback[serviceKey].eyebrow = row.eyebrow;
        fallback[serviceKey].short = row.summary;
        fallback[serviceKey].detail = row.description;
        fallback[serviceKey].items = row.features?.length
          ? row.features
          : fallback[serviceKey].items;
      }
    }
  return fallback;
}
