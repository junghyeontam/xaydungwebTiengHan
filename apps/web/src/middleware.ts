import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. Subdomain deployment support: admin.<domain>
  const isAdminSubdomain =
    hostname.startsWith("admin.") ||
    hostname.startsWith("admin-local.") ||
    req.headers.get("x-forwarded-host")?.startsWith("admin.");

  if (isAdminSubdomain) {
    if (pathname === "/" || pathname === "") {
      return NextResponse.rewrite(new URL("/vi/admin", req.url));
    }
    if (
      !pathname.startsWith("/vi/admin") &&
      !pathname.startsWith("/en/admin") &&
      !pathname.startsWith("/api")
    ) {
      return NextResponse.rewrite(new URL(`/vi/admin${pathname}`, req.url));
    }
    return NextResponse.next();
  }

  // 2. Convenience aliases for direct root admin paths
  const standaloneAdminAliases: Record<string, string> = {
    "/learners": "/vi/admin/learners",
    "/analytics": "/vi/admin/analytics",
    "/sales": "/vi/admin/sales/orders",
    "/consulting": "/vi/admin/sales/leads",
    "/marketing": "/vi/admin/marketing/banners",
    "/settings": "/vi/admin/settings",
    "/settings/roles": "/vi/admin/settings/staff",
    "/settings/audit-log": "/vi/admin/audit-logs",
    "/admin/health": "/vi/admin/health",
    "/admin/_health": "/vi/admin/health",
    "/admin/design": "/vi/admin/design",
    "/admin/_design": "/vi/admin/design",
    "/_design": "/vi/admin/design",
    "/admin/consulting": "/vi/admin/sales/leads",
    "/admin/sales": "/vi/admin/sales/orders",
    "/admin/marketing": "/vi/admin/marketing/banners",
    "/admin/content/lessons/new": "/vi/admin/teaching/lessons/new",
  };

  if (standaloneAdminAliases[pathname]) {
    const target = standaloneAdminAliases[pathname];
    const userRole = req.headers.get("x-user-role") || req.cookies.get("jh_role")?.value;
    if (userRole === "learner") {
      return NextResponse.redirect(new URL("/vi/admin/unauthorized", req.url));
    }
    return NextResponse.rewrite(new URL(target, req.url));
  }

  // 3. Direct path rewrite for /admin and /admin/*
  if (pathname === "/admin") {
    const userRole = req.headers.get("x-user-role") || req.cookies.get("jh_role")?.value;
    if (userRole === "learner") {
      return NextResponse.redirect(new URL("/vi/admin/unauthorized", req.url));
    }
    return NextResponse.rewrite(new URL("/vi/admin", req.url));
  }

  if (pathname.startsWith("/admin/")) {
    const subpath = pathname.replace(/^\/admin/, "");
    const userRole = req.headers.get("x-user-role") || req.cookies.get("jh_role")?.value;
    if (userRole === "learner") {
      return NextResponse.redirect(new URL("/vi/admin/unauthorized", req.url));
    }

    // 2FA enforcement with non-looping exemption
    const require2fa = process.env.ADMIN_REQUIRE_2FA === "true";
    const has2fa = req.cookies.get("jh_admin_2fa")?.value === "verified";
    const isExempt =
      subpath.startsWith("/login") ||
      subpath.startsWith("/unauthorized") ||
      subpath.startsWith("/2fa") ||
      subpath.startsWith("/health");

    if (require2fa && !has2fa && !isExempt) {
      return NextResponse.redirect(new URL("/vi/admin/2fa", req.url));
    }

    return NextResponse.rewrite(new URL(`/vi/admin${subpath}`, req.url));
  }

  // 4. Gate admin API endpoints against learner access
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

  // 5. Section root rewrites for localized admin paths
  if (pathname === "/vi/admin/sales" || pathname === "/en/admin/sales") {
    return NextResponse.rewrite(new URL("/vi/admin/sales/orders", req.url));
  }
  if (pathname === "/vi/admin/consulting" || pathname === "/en/admin/consulting") {
    return NextResponse.rewrite(new URL("/vi/admin/sales/leads", req.url));
  }
  if (pathname === "/vi/admin/marketing" || pathname === "/en/admin/marketing") {
    return NextResponse.rewrite(new URL("/vi/admin/marketing/banners", req.url));
  }

  // 6. Gate /vi/admin or /en/admin directly against learner & unauthorized role access
  if (
    (pathname.startsWith("/vi/admin") || pathname.startsWith("/en/admin")) &&
    !pathname.includes("/login") &&
    !pathname.includes("/unauthorized")
  ) {
    const userRole = req.headers.get("x-user-role") || req.cookies.get("jh_role")?.value;
    if (userRole === "learner") {
      return NextResponse.redirect(new URL("/vi/admin/unauthorized", req.url));
    }

    // Role-specific granular subpath protection
    const staffRole = req.headers.get("x-admin-role") || req.cookies.get("jh_admin_role")?.value;
    if (staffRole) {
      const isSettingsStaff = pathname.includes("/admin/settings/staff") || pathname.includes("/admin/settings/roles");
      if (isSettingsStaff && !["super_admin", "admin"].includes(staffRole)) {
        return NextResponse.redirect(new URL("/vi/admin/unauthorized", req.url));
      }

      const isAuditLogs = pathname.includes("/admin/audit-logs");
      if (isAuditLogs && !["super_admin", "admin", "publisher"].includes(staffRole)) {
        return NextResponse.redirect(new URL("/vi/admin/unauthorized", req.url));
      }

      const isOrders = pathname.includes("/admin/sales/orders");
      if (isOrders && ["content_editor", "teacher"].includes(staffRole)) {
        return NextResponse.redirect(new URL("/vi/admin/unauthorized", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
