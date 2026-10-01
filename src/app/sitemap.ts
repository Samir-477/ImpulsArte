import type { MetadataRoute } from "next";
import { getPublicServices } from "@/lib/public-services";
const pages = [
  "",
  "/services",
  "/services/websites",
  "/services/web-apps",
  "/services/maintenance",
  "/how-it-works",
  "/about",
];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const services = await getPublicServices("es");
  return pages
    .filter((path) => {
      const key = path.split("/")[2] as keyof typeof services;
      return !key || services[key]?.published;
    })
    .map((path) => ({ url: site + (path || "/") }));
}
