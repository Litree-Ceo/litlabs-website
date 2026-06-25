import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/marketplace(.*)",
  "/settings(.*)",
  "/profile(.*)",
  "/agent(.*)",
  "/gallery/(.*)",
  "/api/user-agents(.*)",
  "/api/conversations(.*)",
  "/api/settings/(.*)",
  "/api/wallet(.*)",
  "/api/users/(.*)",
  "/api/account",
  "/api/orchestrate",
]);

const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/about",
  "/contact",
  "/docs",
  "/pricing",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/session",
  "/api/jarvis/notify",
  "/api/stripe/webhook",
  "/api/webhook/clerk",
  "/api/og-image",
];

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const isClerkConfigured = !!(clerkKey && clerkSecretKey);

export default clerkMiddleware(async (auth, req) => {
  if (!isClerkConfigured) {
    const response = NextResponse.next();
    if (PUBLIC_PATHS.some(p => req.nextUrl.pathname.startsWith(p) || req.nextUrl.pathname === p)) {
      response.headers.set("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
    }
    response.headers.set("Vary", "Accept-Encoding");
    return response;
  }

  const { userId } = await auth();
  const response = NextResponse.next();

  if (PUBLIC_PATHS.some(p => req.nextUrl.pathname.startsWith(p) || req.nextUrl.pathname === p)) {
    response.headers.set("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
  }

  if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup")) {
    response.headers.set("Cache-Control", "no-store, must-revalidate");
  }

  response.headers.set("Vary", "Accept-Encoding");

  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/__clerk/:path*",
  ],
};