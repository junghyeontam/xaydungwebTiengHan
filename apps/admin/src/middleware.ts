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
      const userRole =
        req.headers.get("x-user-role") ||
        req.cookies.get("jh_active_role")?.value ||
        req.cookies.get("jh_role")?.value;
      const adminRole =
        req.headers.get("x-admin-role") ||
        req.cookies.get("jh_active_role")?.value ||
        req.nextUrl.searchParams.get("role");
      if (
        userRole === "learner" ||
        adminRole === "learner" ||
        userRole === "guest" ||
        adminRole === "guest"
      ) {
        return NextResponse.json(
          { error: "Forbidden: Learner accounts cannot access admin APIs.", code: "FORBIDDEN" },
          { status: 403 }
        );
      }
    }
    return NextResponse.next();
  }

  // 3. Surface Guard: Block learner, guest and teach-only roles from accessing apps/admin
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
    "/system/roles": "/vi/admin/system/roles",
    "/system/permissions": "/vi/admin/system/permissions",
    "/system/staff": "/vi/admin/system/staff",
    "/system/audit-log": "/vi/admin/system/audit-log",
    "/system/security-audit": "/vi/admin/system/security-audit",
    "/system/backups": "/vi/admin/system/backups",
    "/system/integrations": "/vi/admin/system/integrations",
    "/system/payment-keys": "/vi/admin/system/payment-keys",
    "/system/feature-flags": "/vi/admin/system/feature-flags",
    "/system/maintenance": "/vi/admin/system/maintenance",
    "/system/impersonation": "/vi/admin/system/impersonation",
  };

  if (cleanRouteAliases[pathname]) {
    // System routes strictly require super_admin and 2FA
    if (pathname.startsWith("/system/")) {
      if (userRole && userRole !== "super_admin") {
        return NextResponse.rewrite(
          new URL(
            `/vi/admin/unauthorized?role=${encodeURIComponent(userRole)}&reason=SYSTEM_SUPER_ADMIN_ONLY&surface=system`,
            req.url
          ),
          { status: 403 }
        );
      }
      const is2FA =
        req.headers.get("x-2fa-verified") !== "false" &&
        req.cookies.get("jh_2fa_verified")?.value !== "false";
      if (!is2FA) {
        return NextResponse.rewrite(
          new URL(
            `/vi/admin/unauthorized?role=super_admin&reason=2FA_REQUIRED&surface=system`,
            req.url
          ),
          { status: 403 }
        );
      }
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
