import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { getPublicProperties } from "@/lib/properties-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPublicProperties();
  const now = new Date();

  return [
    {
      url: BRAND.siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BRAND.siteUrl}/inmuebles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...properties.map((p) => ({
      url: `${BRAND.siteUrl}/inmueble/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
