// ============================================================================
// LifeLink — Root Middleware (Supabase session refresh + action gating)
// Public pages (landing, map, inventory, auth) stay anonymous; action
// pages require login and redirect back after signing in.
// ============================================================================

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

// Route prefixes that require a logged-in user
const PROTECTED_PREFIXES = [
  "/broadcast",
  "/command",
  "/donors",
  "/profile",
  "/org",
];

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  // Refresh the auth session cookie on every request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `?redirect=${encodeURIComponent(pathname + request.nextUrl.search)}`;
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

// Match all routes except static files, favicon, and Next.js internals
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
