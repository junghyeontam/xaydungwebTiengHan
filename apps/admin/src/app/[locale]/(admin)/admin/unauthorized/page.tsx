"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import { SurfaceDeniedView } from "@junghyeon/ui";
import { getDefaultSurfaceForRole } from "@junghyeon/rbac";
import type { SurfaceId } from "@junghyeon/config";

export default function AdminUnauthorizedPage() {
  const { currentRole } = useAdminAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = (pathname?.startsWith("/en") ? "en" : "vi") as "vi" | "en";
  const role = searchParams.get("role") || currentRole || "learner";
  const reason = searchParams.get("reason") || "SURFACE_FORBIDDEN";
  const surface = (searchParams.get("surface") || "admin") as SurfaceId;
  const suggested = getDefaultSurfaceForRole(role);

  return (
    <SurfaceDeniedView
      surface={surface}
      activeRole={role}
      reason={reason}
      suggestedSurface={suggested}
      locale={locale}
    />
  );
}
