import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

const privateRoutes = [
  "/dashboard",
  "/subjects",
  "/homework-help",
  "/focus",
  "/textbooks",
  "/print",
  "/printable-pack",
  "/settings",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: privateRoutes,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
