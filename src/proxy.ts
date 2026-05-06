import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/subjects/:path*",
    "/homework-help/:path*",
    "/focus/:path*",
    "/textbooks/:path*",
    "/print/:path*",
    "/printable-pack/:path*",
    "/offline-pack/:path*",
    "/settings/:path*",
    "/login",
    "/api/homework-help/:path*",
  ],
};
