import { notFound } from "next/navigation";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import {
  getSeoLandingPage,
  getSeoLandingPageMetadata,
} from "@/lib/seo";

const page = getSeoLandingPage("cbse-class-10-study-planner");

export const metadata = page ? getSeoLandingPageMetadata(page) : {};

export default function CbseClass10StudyPlannerPage() {
  if (!page) {
    notFound();
  }

  return <SeoLandingPage page={page} />;
}
