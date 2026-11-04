import { NextRequest, NextResponse } from "next/server";

const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3002";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Transitional permanent redirects (308) for legacy /admin, /vi/admin, /en/admin on apps/web
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/vi/admin" ||
    pathname.startsWith("/vi/admin/") ||
    pathname === "/en/admin" ||
    pathname.startsWith("/en/admin/")
  ) {
    const targetUrl = `${ADMIN_ORIGIN.replace(/\/$/, "")}${pathname}${search}`;
    return NextResponse.redirect(targetUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
