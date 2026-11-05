"use client";

import React from "react";
import { useAdminAuth } from "@/features/auth-rbac/AdminAuthContext";
import type { AdminPermission } from "@/features/auth-rbac/types";

interface RbacGuardProps {
  permission?: AdminPermission;
  anyPermissions?: AdminPermission[];
  allPermissions?: AdminPermission[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RbacGuard({
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
  children,
}: RbacGuardProps) {
  const { can, canAny, isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }

  if (anyPermissions && !canAny(anyPermissions)) {
    return <>{fallback}</>;
  }

  if (allPermissions && !allPermissions.every((p) => can(p))) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
