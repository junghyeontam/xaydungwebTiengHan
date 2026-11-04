"use client";

import React, { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SurfaceDeniedView } from "@junghyeon/ui";
import { getDefaultSurfaceForRole } from "@junghyeon/rbac";

function WebUnauthorizedInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = (pathname?.startsWith("/en") ? "en" : "vi") as "vi" | "en";
  const role = searchParams.get("role") || "guest";
  const reason = searchParams.get("reason") || "SURFACE_FORBIDDEN";
  const suggested = getDefaultSurfaceForRole(role);

  return (
    <SurfaceDeniedView
      surface="web"
      activeRole={role}
      reason={reason}
      suggestedSurface={suggested}
      locale={locale}
    />
  );
}

export default function WebUnauthorizedPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh]" />}>
      <WebUnauthorizedInner />
    </Suspense>
  );
}
