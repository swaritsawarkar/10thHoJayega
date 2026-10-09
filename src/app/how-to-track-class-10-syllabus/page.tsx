import { notFound } from "next/navigation";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { getSeoLandingPage, getSeoLandingPageMetadata } from "@/lib/seo";

const page = getSeoLandingPage("how-to-track-class-10-syllabus");

export const metadata = page ? getSeoLandingPageMetadata(page) : {};

export default function HowToTrackClass10SyllabusPage() {
  if (!page) {
    notFound();
  }

  return <SeoLandingPage page={page} />;
}
