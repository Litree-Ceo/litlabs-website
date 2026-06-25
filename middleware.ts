import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = (pathname: string) => {
  const protectedPatterns = [
    "/marketplace",
    "/settings",
    "/profile",
    "/agent",
    "/gallery/",
    "/api/user-agents",
    "/api/conversations",
    "/api/settings",
    "/api/wallet",
    "/api/users",
    "/api/account",
    "/api/orchestrate",
  ];
  return protectedPatterns.some((p) => pathname.startsWith(p));
};

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
  "/api/og-image",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const response = NextResponse.next();

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=1800, stale-while-revalidate=3600",
    );
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    response.headers.set("Cache-Control", "no-store, must-revalidate");
  }

  response.headers.set("Vary", "Accept-Encoding");

  if (isProtectedRoute(pathname)) {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
