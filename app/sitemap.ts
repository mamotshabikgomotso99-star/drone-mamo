import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/technology`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/book`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  let serviceUrls: MetadataRoute.Sitemap = [];
  try {
    const rows = await db.query.services.findMany({ where: (s, { eq: _eq }) => _eq(s.active, true) });
    serviceUrls = (rows ?? []).map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      lastModified: s.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // DB unreachable during build — skip service urls
  }

  return [...staticUrls, ...serviceUrls];
}
