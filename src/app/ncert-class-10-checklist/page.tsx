import { notFound } from "next/navigation";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import {
  getSeoLandingPage,
  getSeoLandingPageMetadata,
} from "@/lib/seo";

const page = getSeoLandingPage("ncert-class-10-checklist");

export const metadata = page ? getSeoLandingPageMetadata(page) : {};

export default function NcertClass10ChecklistPage() {
  if (!page) {
    notFound();
  }

  return <SeoLandingPage page={page} />;
}
