import type { MetadataRoute } from "next";

import { absoluteUrl, publicSeoPages } from "@/lib/seo";

const lastModified = new Date("2026-05-10T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...publicSeoPages.map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: page.priority,
    })),
  ];
}
