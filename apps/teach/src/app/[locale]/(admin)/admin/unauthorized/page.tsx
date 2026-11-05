"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { SurfaceDeniedView } from "@junghyeon/ui";
import { getDefaultSurfaceForRole } from "@junghyeon/rbac";

export default function TeachUnauthorizedPage() {
  const { currentRole } = useAdminAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = (pathname?.startsWith("/en") ? "en" : "vi") as "vi" | "en";
  const role = searchParams.get("role") || currentRole || "learner";
  const reason = searchParams.get("reason") || "SURFACE_FORBIDDEN";
  const suggested = getDefaultSurfaceForRole(role);

  return (
    <SurfaceDeniedView
      surface="teach"
      activeRole={role}
      reason={reason}
      suggestedSurface={suggested}
      locale={locale}
    />
  );
}
