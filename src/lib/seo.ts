import type { Metadata } from "next";

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

export type SeoLandingPage = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  h1: string;
  eyebrow: string;
  intro: string;
  previewTitle: string;
  previewRows: string[];
  highlights: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  priority: number;
};

export const publicSeoPages = [
  {
    slug: "class-10-syllabus-tracker",
    title: "Class 10 Syllabus Tracker",
    description:
      "Track Class 10 CBSE and NCERT chapters, revision status, Maths exercises, textbook links, and printable study checklists in one student-friendly planner.",
    keyword: "Class 10 syllabus tracker",
    h1: "Class 10 syllabus tracker for CBSE students",
    eyebrow: "Syllabus tracker",
    intro:
      "10thHoJayega helps Class 10 students see every subject, chapter, revision status, and next study step without turning planning into another subject.",
    previewTitle: "Subject progress snapshot",
    previewRows: ["Maths", "Science", "Social Science", "English", "Hindi"],
    highlights: [
      "Mark chapters as not started, in progress, revised, mastered, or board-ready.",
      "Open NCERT textbook links from the tracker when a chapter needs reading.",
      "Print a checklist when studying offline feels easier than another screen.",
    ],
    faqs: [
      {
        question: "Is 10thHoJayega made for CBSE Class 10?",
        answer:
          "Yes. The public pages and tracker are written for Class 10 CBSE/NCERT study planning, with subject and chapter progress tools after login.",
      },
      {
        question: "Can I use it without installing an app?",
        answer:
          "Yes. 10thHoJayega runs in the browser and can be used from a phone, tablet, or computer.",
      },
    ],
    priority: 0.95,
  },
  {
    slug: "cbse-class-10-study-planner",
    title: "CBSE Class 10 Study Planner",
    description:
      "Plan CBSE Class 10 study sessions with progress tracking, focus tools, revision status, and printable checklists built for daily exam prep.",
    keyword: "CBSE Class 10 study planner",
    h1: "CBSE Class 10 study planner that keeps things moving",
    eyebrow: "Study planner",
    intro:
      "Use one planner for subjects, chapters, revision, focus blocks, and print-friendly checklists so your study plan stays visible.",
    previewTitle: "Today-ready planning view",
    previewRows: [
      "Choose a subject",
      "Pick the next chapter",
      "Start a focus block",
      "Revise weak topics",
      "Print the plan",
    ],
    highlights: [
      "Plan what to study next instead of guessing from memory.",
      "Use focus mode for Pomodoro blocks, blurting, and simple Feynman practice.",
      "Keep the planner practical for school days, tuition days, and revision days.",
    ],
    faqs: [
      {
        question: "Does this replace my school timetable?",
        answer:
          "No. It works beside your timetable as a progress and revision planner for Class 10 subjects.",
      },
      {
        question: "Can I print my study planner?",
        answer:
          "Yes. The app includes printable planner and checklist tools after login.",
      },
    ],
    priority: 0.9,
  },
  {
    slug: "ncert-class-10-checklist",
    title: "NCERT Class 10 Checklist",
    description:
      "Create a Class 10 NCERT study checklist with chapter progress, revision columns, official textbook links, and printable subject-by-subject planning.",
    keyword: "NCERT Class 10 checklist",
    h1: "NCERT Class 10 checklist for chapters and revision",
    eyebrow: "NCERT checklist",
    intro:
      "Turn Class 10 NCERT study into a clear checklist: chapters to read, exercises to finish, topics to revise, and pages to print.",
    previewTitle: "Printable checklist preview",
    previewRows: [
      "Chapter name",
      "Current status",
      "Revision date",
      "Doubt mark",
      "Final check",
    ],
    highlights: [
      "Use official NCERT textbook links where the app provides textbook access.",
      "Track chapter completion separately from revision confidence.",
      "Print clean checklists for desk study, school bags, and exam weeks.",
    ],
    faqs: [
      {
        question: "Are textbook links official?",
        answer:
          "The app points to official NCERT links where textbook links are provided, instead of re-hosting copyrighted textbook content.",
      },
      {
        question: "Can I use the checklist for revision?",
        answer:
          "Yes. The checklist is designed for chapter completion and revision tracking, not just first-time study.",
      },
    ],
    priority: 0.9,
  },
  {
    slug: "class-10-maths-exercise-tracker",
    title: "Class 10 Maths Exercise Tracker",
    description:
      "Track Class 10 Maths chapters and exercises separately so solved examples, exercise work, revision, and board-ready status stay clear.",
    keyword: "Class 10 Maths exercise tracker",
    h1: "Class 10 Maths exercise tracker for actual practice",
    eyebrow: "Maths tracker",
    intro:
      "Maths is not done when the chapter looks familiar. Track exercises separately so practice progress is visible before exams.",
    previewTitle: "Maths exercise status",
    previewRows: [
      "Chapter selected",
      "Exercise 1.1",
      "Exercise 1.2",
      "Examples revised",
      "Board-ready",
    ],
    highlights: [
      "Separate chapter progress from exercise progress.",
      "Spot the exercises that still need practice before revision week.",
      "Use the printable pack when you want a paper checklist beside your notebook.",
    ],
    faqs: [
      {
        question: "Why track Maths exercises separately?",
        answer:
          "Because reading a Maths chapter and solving its exercises are different jobs. Separate tracking makes weak practice areas easier to see.",
      },
      {
        question: "Does it include a printable Maths tracker?",
        answer:
          "Yes. The printable pack includes Maths exercise tracking after login.",
      },
    ],
    priority: 0.85,
  },
  {
    slug: "printable-class-10-study-planner",
    title: "Printable Class 10 Study Planner",
    description:
      "Print a Class 10 study planner with subject checklists, chapter status, revision date columns, and a simple layout for offline exam prep.",
    keyword: "Printable Class 10 study planner",
    h1: "Printable Class 10 study planner for offline revision",
    eyebrow: "Printable planner",
    intro:
      "Some days the best planner is paper. 10thHoJayega can turn your study progress into clean printable pages for desk revision.",
    previewTitle: "A4 planner layout",
    previewRows: [
      "Subject checklist",
      "Chapter status",
      "Revision date",
      "Maths exercises",
      "Today plan",
    ],
    highlights: [
      "Print a short planner or a fuller subject-by-subject checklist pack.",
      "Use paper planning without losing your saved digital progress.",
      "Keep study status visible during revision blocks and school breaks.",
    ],
    faqs: [
      {
        question: "Can I save the planner as a PDF?",
        answer:
          "Yes. Use the browser print dialog to print or save the printable planner as a PDF.",
      },
      {
        question: "Is the planner only for one subject?",
        answer:
          "No. The printable tools are built for subject-by-subject Class 10 planning.",
      },
    ],
    priority: 0.85,
  },
] as const satisfies SeoLandingPage[];

export function getSeoLandingPage(slug: string) {
  return publicSeoPages.find((page) => page.slug === slug) ?? null;
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function getSeoLandingPageMetadata(page: SeoLandingPage): Metadata {
  return {
    title: page.title,
    description: page.description,
    keywords: [page.keyword, ...siteConfig.keywords],
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `/${page.slug}`,
      siteName: siteConfig.name,
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | ${siteConfig.name}`,
      description: page.description,
    },
  };
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

export function getSeoLandingPageJsonLd(page: SeoLandingPage) {
  const pageUrl = absoluteUrl(`/${page.slug}`);
  const homeUrl = absoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: page.title,
        description: page.description,
        inLanguage: "en-IN",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${homeUrl}#website`,
          name: siteConfig.name,
          url: homeUrl,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}
