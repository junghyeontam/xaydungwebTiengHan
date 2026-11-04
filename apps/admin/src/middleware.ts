import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Allow API routes and static files directly, with learner role block on /api/admin
  if (pathname.startsWith("/api")) {
    if (pathname.startsWith("/api/admin")) {
      const userRole = req.headers.get("x-user-role") || req.cookies.get("jh_role")?.value;
      const adminRole = req.headers.get("x-admin-role") || req.nextUrl.searchParams.get("role");
      if (userRole === "learner" || adminRole === "learner") {
        return NextResponse.json(
          { error: "Forbidden: Learner accounts cannot access admin APIs." },
          { status: 403 }
        );
      }
    }
    return NextResponse.next();
  }

  // 2. Surface Guard: Block learner role from accessing any staff page
  const userRole =
    req.headers.get("x-user-role") ||
    req.cookies.get("jh_role")?.value ||
    req.cookies.get("jh_admin_role")?.value;

  if (
    userRole === "learner" &&
    !pathname.includes("/unauthorized") &&
    !pathname.includes("/login")
  ) {
    return NextResponse.rewrite(new URL("/vi/admin/unauthorized", req.url), { status: 403 });
  }

  // 3. Canonical clean paths for apps/admin -> rewrite to /vi/admin/*
  const cleanRouteAliases: Record<string, string> = {
    "/": "/vi/admin",
    "/login": "/vi/admin/login",
    "/2fa": "/vi/admin/2fa",
    "/unauthorized": "/vi/admin/unauthorized",
    "/learners": "/vi/admin/learners",
    "/sales": "/vi/admin/sales/orders",
    "/sales/orders": "/vi/admin/sales/orders",
    "/leads": "/vi/admin/sales/leads",
    "/appointments": "/vi/admin/sales/leads",
    "/support": "/vi/admin/learners",
    "/campaigns": "/vi/admin/marketing/banners",
    "/banners": "/vi/admin/marketing/banners",
    "/coupons": "/vi/admin/marketing/coupons",
    "/analytics": "/vi/admin/analytics",
    "/reports": "/vi/admin/analytics",
    "/content-health": "/vi/admin/content/lessons",
    "/settings": "/vi/admin/settings",
    "/system/roles": "/vi/admin/settings/roles",
    "/system/permissions": "/vi/admin/settings/roles",
    "/system/staff": "/vi/admin/settings/staff",
    "/system/audit-log": "/vi/admin/audit-logs",
    "/system/security-audit": "/vi/admin/health",
    "/system/backups": "/vi/admin/health",
    "/system/integrations": "/vi/admin/settings",
    "/system/payment-keys": "/vi/admin/settings",
    "/system/feature-flags": "/vi/admin/settings",
    "/system/maintenance": "/vi/admin/settings",
    "/system/impersonation": "/vi/admin/settings/staff",
  };

  if (cleanRouteAliases[pathname]) {
    // System routes strictly require super_admin
    if (pathname.startsWith("/system/") && userRole && userRole !== "super_admin") {
      return NextResponse.rewrite(new URL("/vi/admin/unauthorized", req.url), { status: 403 });
    }
    return NextResponse.rewrite(new URL(cleanRouteAliases[pathname], req.url));
  }

  // 4. Support /admin and /admin/* paths on apps/admin for seamless compatibility
  if (pathname === "/admin") {
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
