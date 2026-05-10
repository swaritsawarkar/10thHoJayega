import { notFound } from "next/navigation";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import {
  getSeoLandingPage,
  getSeoLandingPageMetadata,
} from "@/lib/seo";

const page = getSeoLandingPage("printable-class-10-study-planner");

export const metadata = page ? getSeoLandingPageMetadata(page) : {};

export default function PrintableClass10StudyPlannerPage() {
  if (!page) {
    notFound();
  }

  return <SeoLandingPage page={page} />;
}
