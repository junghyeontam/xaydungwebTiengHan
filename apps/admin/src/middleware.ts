import { NextRequest, NextResponse } from "next/server";

const TEACH_ORIGIN = process.env.NEXT_PUBLIC_TEACH_URL || "http://localhost:3001";

const ALLOWED_ADMIN_ROLES = new Set([
  "admin",
  "sales_crm",
  "support_agent",
  "marketing",
  "read_only",
  "super_admin",
]);

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1. Transitional 308 redirects for Teacher Studio routes requested on apps/admin
  if (
    pathname.startsWith("/admin/teaching") ||
    pathname.startsWith("/vi/admin/teaching") ||
    pathname.startsWith("/en/admin/teaching") ||
    pathname === "/admin/publishing" ||
    pathname === "/vi/admin/publishing" ||
    pathname === "/en/admin/publishing"
  ) {
    const cleanPath = pathname
      .replace(/^\/(vi|en)\/admin\/teaching/, "")
      .replace(/^\/admin\/teaching/, "")
      .replace(/^\/(vi|en)\/admin\/publishing/, "/publishing")
      .replace(/^\/admin\/publishing/, "/publishing");
    const targetUrl = `${TEACH_ORIGIN.replace(/\/$/, "")}${cleanPath || "/lessons"}${search}`;
    return NextResponse.redirect(targetUrl, 308);
  }

  // 2. Allow API routes and static files directly, with role block on /api/admin
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

  // 3. Surface Guard: Block learner and teach-only roles from accessing apps/admin
  const userRole =
    req.headers.get("x-user-role") ||
    req.headers.get("x-admin-role") ||
    req.cookies.get("jh_active_role")?.value ||
    req.cookies.get("jh_role")?.value ||
    req.cookies.get("jh_admin_role")?.value ||
    req.nextUrl.searchParams.get("role");

  if (
    userRole &&
    !ALLOWED_ADMIN_ROLES.has(userRole) &&
    !pathname.includes("/unauthorized") &&
    !pathname.includes("/login")
  ) {
    return NextResponse.rewrite(
      new URL(
        `/vi/admin/unauthorized?role=${encodeURIComponent(userRole)}&reason=SURFACE_FORBIDDEN&surface=admin`,
        req.url
      ),
      { status: 403 }
    );
  }

  // 4. Canonical clean paths for apps/admin -> rewrite to /vi/admin/*
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
      return NextResponse.rewrite(
        new URL(
          `/vi/admin/unauthorized?role=${encodeURIComponent(userRole)}&reason=SYSTEM_SUPER_ADMIN_ONLY&surface=system`,
          req.url
        ),
        { status: 403 }
      );
    }
    return NextResponse.rewrite(new URL(cleanRouteAliases[pathname], req.url));
  }

  // 5. Support /admin and /admin/* paths on apps/admin for compatibility
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
