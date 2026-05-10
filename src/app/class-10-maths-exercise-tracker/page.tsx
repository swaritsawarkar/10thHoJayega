import { notFound } from "next/navigation";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import {
  getSeoLandingPage,
  getSeoLandingPageMetadata,
} from "@/lib/seo";

const page = getSeoLandingPage("class-10-maths-exercise-tracker");

export const metadata = page ? getSeoLandingPageMetadata(page) : {};

export default function Class10MathsExerciseTrackerPage() {
  if (!page) {
    notFound();
  }

  return <SeoLandingPage page={page} />;
}
