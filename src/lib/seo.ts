export const SITE_URL_FALLBACK = "https://10thhojayega.vercel.app";

function normalizeSiteUrl(url: string) {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return SITE_URL_FALLBACK;
  }

  const urlWithProtocol = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  return new URL(urlWithProtocol).origin;
}

export const siteConfig = {
  name: "10thHoJayega",
  shortName: "10thHoJayega",
  description:
    "Class 10 CBSE and NCERT syllabus tracker with progress tracking, Maths exercise status, focus mode, official textbook links, and printable study checklists.",
  url: normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.VERCEL_PROJECT_PRODUCTION_URL ??
      process.env.VERCEL_URL ??
      SITE_URL_FALLBACK,
  ),
  keywords: [
    "Class 10 syllabus tracker",
    "CBSE Class 10 study planner",
    "NCERT Class 10 progress tracker",
    "Class 10 printable checklist",
    "Maths exercise tracker",
    "Class 10 focus timer",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function getHomeJsonLd() {
  const homeUrl = absoluteUrl("/");
  const organizationId = `${homeUrl}#organization`;
  const websiteId = `${homeUrl}#website`;
  const appId = `${homeUrl}#web-application`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url: homeUrl,
        logo: absoluteUrl("/icon.svg"),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteConfig.name,
        url: homeUrl,
        description: siteConfig.description,
        inLanguage: "en-IN",
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "WebApplication",
        "@id": appId,
        name: siteConfig.name,
        url: homeUrl,
        description: siteConfig.description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "USD",
        },
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "student",
        },
        featureList: [
          "Class 10 syllabus progress tracking",
          "Maths exercise status tracking",
          "Pomodoro focus mode",
          "Official NCERT textbook links",
          "Printable syllabus checklists",
        ],
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  };
}
