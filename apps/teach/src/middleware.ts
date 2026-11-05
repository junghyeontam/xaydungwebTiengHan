import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TEACH_ROLES = new Set([
  "teacher",
  "content_editor",
  "publisher",
  "super_admin",
]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Protect API endpoints on apps/teach
  if (pathname.startsWith("/api")) {
    const userRole =
      req.headers.get("x-user-role") ||
      req.headers.get("x-admin-role") ||
      req.cookies.get("jh_role")?.value ||
      req.cookies.get("jh_admin_role")?.value;

    if (userRole && !ALLOWED_TEACH_ROLES.has(userRole)) {
      return NextResponse.json(
        { error: `Forbidden: Role '${userRole}' is not authorized for Teacher Studio.` },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // 2. Surface Guard: Only teacher, content_editor, publisher, super_admin allowed
  const userRole =
    req.headers.get("x-user-role") ||
    req.headers.get("x-admin-role") ||
    req.cookies.get("jh_active_role")?.value ||
    req.cookies.get("jh_role")?.value ||
    req.cookies.get("jh_admin_role")?.value ||
    req.nextUrl.searchParams.get("role") ||
    "guest";

  if (
    userRole &&
    !ALLOWED_TEACH_ROLES.has(userRole) &&
    !pathname.includes("/unauthorized") &&
    !pathname.includes("/login")
  ) {
    return NextResponse.rewrite(
      new URL(
        `/vi/admin/unauthorized?role=${encodeURIComponent(userRole)}&reason=SURFACE_FORBIDDEN&surface=teach`,
        req.url
      ),
      { status: 403 }
    );
  }

  // 3. Clean route aliases for Teacher Studio (teach.junghyeon.com)
  const cleanTeachRoutes: Record<string, string> = {
    "/": "/vi/admin",
    "/login": "/vi/admin/login",
    "/2fa": "/vi/admin/2fa",
    "/unauthorized": "/vi/admin/unauthorized",
    "/lessons": "/vi/admin/teaching/lessons",
    "/lessons/new": "/vi/admin/teaching/lessons/new",
    "/banks/vocabulary": "/vi/admin/teaching/vocabulary",
    "/banks/grammar": "/vi/admin/teaching/grammar",
    "/roadmap-planner": "/vi/admin/teaching/roadmap",
    "/review-feedback": "/vi/admin/teaching/feedback",
    "/publishing": "/vi/admin/publishing",
    "/classes": "/vi/admin/teaching/classes",
    "/grading": "/vi/admin/teaching/grading",
    "/analytics": "/vi/admin/teaching/analytics",
    "/media": "/vi/admin/teaching/media",
  };

  if (cleanTeachRoutes[pathname]) {
    return NextResponse.rewrite(new URL(cleanTeachRoutes[pathname], req.url));
  }

  // Dynamic /lessons/[id]/edit
  const editMatch = pathname.match(/^\/lessons\/([^/]+)\/edit$/);
  if (editMatch) {
    return NextResponse.rewrite(
      new URL(`/vi/admin/teaching/lessons/${editMatch[1]}/edit`, req.url)
    );
  }

  // Compatibility for /admin/teaching/* paths
  if (pathname === "/admin" || pathname === "/admin/teaching") {
    return NextResponse.rewrite(new URL("/vi/admin", req.url));
  }
  if (pathname.startsWith("/admin/")) {
    const subpath = pathname.replace(/^\/admin/, "");
    return NextResponse.rewrite(new URL(`/vi/admin${subpath}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
