"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AdminRole, AdminPermission } from "./types";
import { ROLE_DEFINITIONS, hasPermission, hasAnyPermission, hasAllPermissions } from "./permissions";
import { AdminUserSession } from "@/types/admin.types";

export interface AdminAuthContextType {
  adminUser: AdminUserSession | null;
  user: {
    id: string;
    email: string;
    name: string;
    roleName: string;
    permissions: AdminPermission[];
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeRole: AdminRole;
  currentRole: AdminRole;
  switchRole: (role: AdminRole) => void;
  login: (email: string, passwordOrRole?: string | AdminRole, maybeRole?: AdminRole) => void;
  logout: () => void;
  can: (permission: AdminPermission | AdminPermission[]) => boolean;
  canAny: (permissions: AdminPermission[]) => boolean;
  canAll: (permissions: AdminPermission[]) => boolean;
}

const DEFAULT_ADMIN_USER: AdminUserSession = {
  id: "admin-super-001",
  email: "admin@junghyeon.vn",
  fullName: "JungHyeon Master Administrator",
  role: "super_admin",
  permissions: ROLE_DEFINITIONS.super_admin.permissions,
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from localStorage or load default super_admin in development
  useEffect(() => {
    try {
      const stored = localStorage.getItem("junghyeon_admin_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAdminUser(parsed);
        if (typeof document !== "undefined") {
          document.cookie = `jh_admin_role=${parsed.role || "super_admin"}; path=/; max-age=86400`;
        }
      } else {
        setAdminUser(DEFAULT_ADMIN_USER);
        localStorage.setItem("junghyeon_admin_session", JSON.stringify(DEFAULT_ADMIN_USER));
        if (typeof document !== "undefined") {
          document.cookie = `jh_admin_role=super_admin; path=/; max-age=86400`;
        }
      }
    } catch {
      setAdminUser(DEFAULT_ADMIN_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchRole = (role: AdminRole) => {
    const roleDef = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.super_admin;
    const base = adminUser || DEFAULT_ADMIN_USER;
    const updated: AdminUserSession = {
      ...base,
      role,
      permissions: roleDef.permissions,
    };
    setAdminUser(updated);
    try {
      localStorage.setItem("junghyeon_admin_session", JSON.stringify(updated));
      if (typeof document !== "undefined") {
        document.cookie = `jh_admin_role=${role}; path=/; max-age=86400`;
      }
    } catch {}
  };

  const login = (
    email: string,
    passwordOrRole?: string | AdminRole,
    maybeRole?: AdminRole
  ) => {
    let chosenRole: AdminRole = "super_admin";
    if (passwordOrRole && typeof passwordOrRole === "string" && passwordOrRole in ROLE_DEFINITIONS) {
      chosenRole = passwordOrRole as AdminRole;
    } else if (maybeRole && maybeRole in ROLE_DEFINITIONS) {
      chosenRole = maybeRole;
    }

    const roleDef = ROLE_DEFINITIONS[chosenRole] || ROLE_DEFINITIONS.super_admin;
    const session: AdminUserSession = {
      id: `admin-${Date.now()}`,
      email,
      fullName: email.split("@")[0] || "Administrator",
      role: chosenRole,
      permissions: roleDef.permissions,
    };
    setAdminUser(session);
    try {
      localStorage.setItem("junghyeon_admin_session", JSON.stringify(session));
      if (typeof document !== "undefined") {
        document.cookie = `jh_admin_role=${chosenRole}; path=/; max-age=86400`;
      }
    } catch {}
  };

  const logout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem("junghyeon_admin_session");
      if (typeof document !== "undefined") {
        document.cookie = `jh_admin_role=; path=/; max-age=0`;
      }
    } catch {}
  };

  const can = (permission: AdminPermission | AdminPermission[]) => {
    if (!adminUser) return false;
    return hasPermission(adminUser.permissions, permission);
  };

  const canAny = (permissions: AdminPermission[]) => {
    if (!adminUser) return false;
    return hasAnyPermission(adminUser.permissions, permissions);
  };

  const canAll = (permissions: AdminPermission[]) => {
    if (!adminUser) return false;
    return hasAllPermissions(adminUser.permissions, permissions);
  };

  const activeRole: AdminRole = adminUser?.role || "super_admin";
  const roleMeta = ROLE_DEFINITIONS[activeRole];

  const user = adminUser
    ? {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.fullName,
        roleName: roleMeta ? roleMeta.nameVi : activeRole,
        permissions: adminUser.permissions,
      }
    : null;

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        user,
        isAuthenticated: !!adminUser,
        isLoading,
        activeRole,
        currentRole: activeRole,
        switchRole,
        login,
        logout,
        can,
        canAny,
        canAll,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
